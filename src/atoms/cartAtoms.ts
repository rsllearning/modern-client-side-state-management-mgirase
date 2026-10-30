import { atom } from 'jotai';
import type { CartItem, Product, CheckoutResult } from '../types';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

// 1. Primitive atom: Core state holding cart items
export const cartItemsAtom = atom<CartItem[]>([]);

// 2. Derived, read-only atoms: Automatically recompute based on atom dependencies without useMemo
export const cartCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.qty, 0)
);

export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.price * item.qty, 0)
);

// 3. Write-only action atoms: Encapsulate operations without subscribing to values
export const addItemAtom = atom(null, (get, set, product: Product) => {
  const items = get(cartItemsAtom);
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    set(
      cartItemsAtom,
      items.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  } else {
    set(cartItemsAtom, [...items, { ...product, qty: 1 }]);
  }

  // If previous checkout was successful, reset status on new item addition
  if (get(checkoutStatusAtom) === 'success') {
    set(checkoutStatusAtom, 'idle');
    set(orderResultAtom, null);
  }
});

export const removeItemAtom = atom(null, (get, set, id: string) => {
  set(
    cartItemsAtom,
    get(cartItemsAtom).filter((item) => item.id !== id)
  );
});

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, []);
});

// Checkout state atoms
export const checkoutStatusAtom = atom<CheckoutStatus>('idle');
export const checkoutErrorAtom = atom<string | null>(null);
export const orderResultAtom = atom<CheckoutResult | null>(null);

// Async checkout write-only action atom
export const checkoutAtom = atom(null, async (get, set) => {
  const items = get(cartItemsAtom);
  if (items.length === 0) return;

  set(checkoutStatusAtom, 'submitting');
  set(checkoutErrorAtom, null);

  const total = get(cartTotalAtom);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        total,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error(`Checkout failed with status: ${res.status}`);
    }

    const orderData: CheckoutResult = await res.json();
    set(cartItemsAtom, []);
    set(checkoutStatusAtom, 'success');
    set(orderResultAtom, orderData);
    set(checkoutErrorAtom, null);
  } catch (err) {
    set(checkoutStatusAtom, 'error');
    set(checkoutErrorAtom, (err as Error).message || 'Checkout failed');
  }
});

