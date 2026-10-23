import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStorage } from '../lib/storage';
import type { Product } from '../types';

/** What the wishlist and "recently viewed" keep of a saree: enough to draw a small card. */
export interface SavedSaree {
  id: string;
  slug: string;
  name: string;
  type: string;
  price: number;
  image?: string;
  alt?: string;
}

export const toSaved = (p: Product): SavedSaree => ({
  id: p._id,
  slug: p.slug,
  name: p.name,
  type: p.type,
  price: p.price,
  image: p.images[0]?.url,
  alt: p.images[0]?.alt,
});

const RECENT_MAX = 8;

interface SavedState {
  wishlist: SavedSaree[];
  recent: SavedSaree[];
  toggleWish: (product: Product) => boolean; // true when added
  removeWish: (id: string) => void;
  viewed: (product: Product) => void;
}

/** Wishlist and recently viewed sarees, saved in this browser. */
export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      recent: [],

      toggleWish: (product) => {
        const exists = get().wishlist.some((s) => s.id === product._id);
        set((state) => ({
          wishlist: exists
            ? state.wishlist.filter((s) => s.id !== product._id)
            : [toSaved(product), ...state.wishlist],
        }));
        return !exists;
      },

      removeWish: (id) => set((state) => ({ wishlist: state.wishlist.filter((s) => s.id !== id) })),

      viewed: (product) =>
        set((state) => ({
          recent: [toSaved(product), ...state.recent.filter((s) => s.id !== product._id)].slice(
            0,
            RECENT_MAX,
          ),
        })),
    }),
    {
      name: 'sk:saved',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
