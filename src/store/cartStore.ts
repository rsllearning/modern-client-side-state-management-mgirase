import { create } from 'zustand';
import type { CartItem, Product, CheckoutResult } from '../types';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface CartStoreState {
  items: CartItem[];
  status: CheckoutStatus;
  errorMessage: string | null;
  orderResult: CheckoutResult | null;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  checkout: () => Promise<void>;
}

export const useCartStore = create<CartStoreState>()((set, get) => ({
  items: [],
  status: 'idle',
  errorMessage: null,
  orderResult: null,

  addItem: (product: Product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      return {
        status: state.status === 'success' ? 'idle' : state.status,
        errorMessage: state.status === 'success' ? null : state.errorMessage,
        orderResult: state.status === 'success' ? null : state.orderResult,
        items: existing
          ? state.items.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            )
          : [...state.items, { ...product, qty: 1 }],
      };
    }),

  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clear: () =>
    set({
      items: [],
      status: 'idle',
      errorMessage: null,
      orderResult: null,
    }),

  checkout: async () => {
    const currentItems = get().items;
    if (currentItems.length === 0) return;

    set({ status: 'submitting', errorMessage: null });

    const total = currentItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: currentItems,
          total,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Checkout failed with status: ${res.status}`);
      }

      const orderData: CheckoutResult = await res.json();
      set({
        items: [],
        status: 'success',
        orderResult: orderData,
        errorMessage: null,
      });
    } catch (err) {
      set({
        status: 'error',
        errorMessage: (err as Error).message || 'Checkout failed',
      });
    }
  },
}));

// Derived selectors strictly computed — not duplicated in stored state
export const selectCartTotal = (state: CartStoreState): number =>
  state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

export const selectCartCount = (state: CartStoreState): number =>
  state.items.reduce((sum, item) => sum + item.qty, 0);
