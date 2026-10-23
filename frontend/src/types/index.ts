export interface PhotoCredit {
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  credit: PhotoCredit | null;
}

export interface Product {
  _id: string;
  id?: string;
  slug: string;
  name: string;
  nameBn?: string;
  type: string;
  fabric: string;
  weave: string;
  origin: string;
  colors: string[];
  occasions: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  withBlousePiece: boolean;
  handwoven: boolean;
  length: { sareeMetres: number; blouseMetres: number };
  care: string;
  description: string;
  images: ProductImage[];
  popularity: number;
  isNewArrival: boolean;
  bestSeller: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SareeType {
  name: string;
  slug: string;
  bn: string;
  blurb: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export type DeliveryZone = 'inside-dhaka' | 'outside-dhaka';

export interface Meta {
  types: SareeType[];
  fabrics: string[];
  occasions: string[];
  colors: ColorOption[];
  priceRange: { min: number; max: number };
  defaultLength: { sareeMetres: number; blouseMetres: number };
  fallPicoPrice: number;
  divisions: Record<string, string[]>;
  delivery: {
    fees: Record<DeliveryZone, number>;
    days: Record<DeliveryZone, { from: number; to: number }>;
  };
  maxQtyPerLine: number;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  active: boolean;
}

export type SortKey = 'popular' | 'new' | 'price-asc' | 'price-desc';

export interface CatalogFilters {
  q: string;
  types: string[]; // type slugs
  fabrics: string[];
  colors: string[];
  occasions: string[];
  minPrice?: number;
  maxPrice?: number;
  blouse: boolean;
  handwoven: boolean;
  sort: SortKey;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  facets: { types: Record<string, number> };
}

export interface ProductDetailResponse {
  product: Product;
  related: Product[];
}

export interface CartItem {
  key: string; // productId + add-on
  productId: string;
  slug: string;
  name: string;
  type: string;
  price: number;
  image?: string;
  alt?: string;
  fallPico: boolean;
  qty: number;
}

export interface AppliedCoupon {
  code: string;
  percent: number;
}

export interface CouponResult extends AppliedCoupon {
  valid: boolean;
  discount: number;
  message: string;
  description?: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod';

export interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  note: string;
}

export interface CreateOrderPayload {
  items: { productId: string; qty: number; fallPico: boolean }[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  couponCode: string | null;
}

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product: string;
  slug: string;
  name: string;
  type: string;
  image: string;
  qty: number;
  fallPico: boolean;
  unitPrice: number;
  addOnPrice: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shipping: ShippingInfo & { division: string };
  deliveryZone: DeliveryZone;
  payment: { method: PaymentMethod; status: 'demo-paid' | 'cod-pending' };
  pricing: {
    subtotal: number;
    addOns: number;
    couponCode: string | null;
    discount: number;
    deliveryFee: number;
    total: number;
  };
  estimatedDelivery: { from: string; to: string };
  status: OrderStatus;
  isDemo: boolean;
  createdAt: string;
}
