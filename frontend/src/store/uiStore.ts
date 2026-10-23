import { create } from 'zustand';
import type { Product } from '../types';

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; to: string };
}

interface UiState {
  bagOpen: boolean;
  quickView: Product | null;
  toasts: Toast[];
  openBag: () => void;
  closeBag: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  toast: (message: string, action?: Toast['action']) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

/** Overlays and toasts (view state only, never saved). */
export const useUi = create<UiState>()((set, get) => ({
  bagOpen: false,
  quickView: null,
  toasts: [],
  openBag: () => set({ bagOpen: true, quickView: null }),
  closeBag: () => set({ bagOpen: false }),
  openQuickView: (product) => set({ quickView: product }),
  closeQuickView: () => set({ quickView: null }),
  toast: (message, action) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts.slice(-2), { id, message, action }] }));
    window.setTimeout(() => get().dismiss(id), 4200);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
