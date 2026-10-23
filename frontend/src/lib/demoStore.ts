import snapshot from '../content/demoCatalog.json';
import { deliveryZoneFor, DELIVERY_FEES, FALL_PICO_PRICE } from './pricing';
import { safeStorage } from './storage';
import type {
  Banner,
  CouponResult,
  CreateOrderPayload,
  Meta,
  Order,
  Product,
  ProductDetailResponse,
  ProductListResponse,
} from '../types';

/**
 * Offline stand-in for the API, built on the catalog snapshot that
 * backend/scripts/exportDemoCatalog.js writes. Used only when the API cannot be reached,
 * so the demo store keeps working (and is never empty). Mirrors the backend controllers.
 */
const products = snapshot.products as unknown as Product[];
export const demoMeta = snapshot.meta as unknown as Meta;
export const demoBanners = snapshot.banners as unknown as Banner[];

const SORTS: Record<string, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.popularity - a.popularity || b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price || b.popularity - a.popularity,
  'price-desc': (a, b) => b.price - a.price || b.popularity - a.popularity,
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
};

const list = (value?: string) => (value ? value.split(',').filter(Boolean) : []);
const typeNames = (slugs: string[]) =>
  demoMeta.types.filter((t) => slugs.includes(t.slug)).map((t) => t.name);
const some = (wanted: string[], have: string[]) => wanted.some((w) => have.includes(w));

function matches(p: Product, params: Record<string, string>, omitType = false) {
  const types = typeNames(list(params.type));
  if (!omitType && types.length && !types.includes(p.type)) return false;
  const fabrics = list(params.fabric);
  if (fabrics.length && !fabrics.includes(p.fabric)) return false;
  const colors = list(params.color);
  if (colors.length && !some(colors, p.colors)) return false;
  const occasions = list(params.occasion);
  if (occasions.length && !some(occasions, p.occasions)) return false;
  if (params.minPrice && p.price < Number(params.minPrice)) return false;
  if (params.maxPrice && p.price > Number(params.maxPrice)) return false;
  if (params.blouse === 'true' && !p.withBlousePiece) return false;
  if (params.handwoven === 'true' && !p.handwoven) return false;
  if (params.isNew === 'true' && !p.isNewArrival) return false;
  if (params.best === 'true' && !p.bestSeller) return false;
  const words = (params.q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const fields = [p.name, p.nameBn, p.type, p.fabric, p.weave, ...p.colors, ...p.occasions]
    .join(' ')
    .toLowerCase();
  return words.every((word) =>
    new RegExp(`(^|[^a-z])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(fields),
  );
}

export function demoProducts(params: Record<string, string>): ProductListResponse {
  const found = products
    .filter((p) => matches(p, params))
    .sort(SORTS[params.sort] || SORTS.popular)
    .slice(0, Number(params.limit) || 100);

  const types = Object.fromEntries(demoMeta.types.map((t) => [t.slug, 0]));
  products
    .filter((p) => matches(p, params, true))
    .forEach((p) => {
      const slug = demoMeta.types.find((t) => t.name === p.type)?.slug;
      if (slug) types[slug] += 1;
    });

  return { products: found, total: found.length, facets: { types } };
}

export function demoProduct(slug: string): ProductDetailResponse | null {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  const others = products.filter((p) => p._id !== product._id).sort(SORTS.popular);
  const sameType = others.filter((p) => p.type === product.type);
  const related = sameType
    .concat(others.filter((p) => p.type !== product.type && some(p.occasions, product.occasions)))
    .slice(0, 4);
  return { product, related };
}

export function demoCoupon(code: string, subtotal: number): CouponResult | null {
  const coupon = snapshot.coupons.find((c) => c.code === code.trim().toUpperCase());
  if (!coupon) return null;
  return {
    valid: true,
    code: coupon.code,
    percent: coupon.percent,
    discount: Math.round((subtotal * coupon.percent) / 100),
    message: `${coupon.code} applied: ${coupon.percent}% off`,
  };
}

// Demo orders placed offline are kept in this browser so "Track order" can find them
const ORDERS_KEY = 'sk:demo-orders';

function savedOrders(): Order[] {
  try {
    return JSON.parse((safeStorage.getItem(ORDERS_KEY) as string | null) || '[]') as Order[];
  } catch {
    return [];
  }
}

export function demoCreateOrder(payload: CreateOrderPayload): Order {
  const items = payload.items.map((item) => {
    const product = products.find((p) => p._id === item.productId);
    if (!product) throw new Error('A saree in your bag is no longer available.');
    const addOnPrice = item.fallPico ? FALL_PICO_PRICE : 0;
    return {
      product: product._id,
      slug: product.slug,
      name: product.name,
      type: product.type,
      image: product.images[0]?.url ?? '',
      qty: item.qty,
      fallPico: item.fallPico,
      unitPrice: product.price,
      addOnPrice,
      lineTotal: (product.price + addOnPrice) * item.qty,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const addOns = items.reduce((sum, item) => sum + item.addOnPrice * item.qty, 0);
  const coupon = payload.couponCode ? demoCoupon(payload.couponCode, subtotal) : null;
  const discount = coupon?.discount ?? 0;
  const deliveryZone = deliveryZoneFor(payload.shipping.district);
  const deliveryFee = DELIVERY_FEES[deliveryZone];
  const days = demoMeta.delivery.days[deliveryZone];
  const addDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString();
  const division =
    Object.entries(demoMeta.divisions).find(([, districts]) =>
      districts.includes(payload.shipping.district),
    )?.[0] ?? '';

  const order: Order = {
    _id: `demo-${Date.now()}`,
    orderNumber: `SK-${Math.floor(10000 + Math.random() * 90000)}`,
    items,
    shipping: { ...payload.shipping, division },
    deliveryZone,
    payment: {
      method: payload.paymentMethod,
      status: payload.paymentMethod === 'cod' ? 'cod-pending' : 'demo-paid',
    },
    pricing: {
      subtotal,
      addOns,
      couponCode: coupon?.code ?? null,
      discount,
      deliveryFee,
      total: subtotal + addOns - discount + deliveryFee,
    },
    estimatedDelivery: { from: addDays(days.from), to: addDays(days.to) },
    status: 'placed',
    isDemo: true,
    createdAt: new Date().toISOString(),
  };

  safeStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...savedOrders()].slice(0, 20)));
  return order;
}

export function demoGetOrder(orderNumber: string, phone: string): Order | null {
  return (
    savedOrders().find(
      (order) => order.orderNumber === orderNumber.toUpperCase() && order.shipping.phone === phone,
    ) ?? null
  );
}
