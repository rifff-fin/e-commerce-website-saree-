import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStorage } from '../lib/storage';
import { MAX_QTY_PER_LINE } from '../lib/pricing';
import type { AppliedCoupon, CartItem, DeliveryZone, Product } from '../types';

interface CartState {
  items: CartItem[];
  zone: DeliveryZone;
  coupon: AppliedCoupon | null;
  add: (product: Product, qty: number, fallPico: boolean) => void;
  setQty: (key: string, qty: number) => void;
  setFallPico: (key: string, fallPico: boolean) => void;
  remove: (key: string) => void;
  clear: () => void;
  setZone: (zone: DeliveryZone) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
}

const clampQty = (qty: number) => Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.round(qty)));
const keyOf = (productId: string, fallPico: boolean) => `${productId}:${fallPico ? 'fp' : 'plain'}`;

/** The bag (model). Saved to localStorage, or kept in memory when storage is unavailable. */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      zone: 'inside-dhaka',
      coupon: null,

      add: (product, qty, fallPico) =>
        set((state) => {
          const key = keyOf(product._id, fallPico);
          const existing = state.items.find((item) => item.key === key);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key ? { ...item, qty: clampQty(item.qty + qty) } : item,
              ),
            };
          }
          const item: CartItem = {
            key,
            productId: product._id,
            slug: product.slug,
            name: product.name,
            type: product.type,
            price: product.price,
            image: product.images[0]?.url,
            alt: product.images[0]?.alt,
            fallPico,
            qty: clampQty(qty),
          };
          return { items: [item, ...state.items] };
        }),

      setQty: (key, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, qty: clampQty(qty) } : item,
          ),
        })),

      // Toggling the add-on may merge the line into an existing one with the same choice
      setFallPico: (key, fallPico) =>
        set((state) => {
          const line = state.items.find((item) => item.key === key);
          if (!line || line.fallPico === fallPico) return state;
          const newKey = keyOf(line.productId, fallPico);
          const twin = state.items.find((item) => item.key === newKey);
          if (twin) {
            return {
              items: state.items
                .filter((item) => item.key !== key)
                .map((item) =>
                  item.key === newKey ? { ...item, qty: clampQty(item.qty + line.qty) } : item,
                ),
            };
          }
          return {
            items: state.items.map((item) =>
              item.key === key ? { ...item, key: newKey, fallPico } : item,
            ),
          };
        }),

      remove: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),

      clear: () => set({ items: [], coupon: null }),

      setZone: (zone) => set({ zone }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),
    }),
    {
      name: 'sk:cart',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ items, zone, coupon }) => ({ items, zone, coupon }),
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.qty, 0);
