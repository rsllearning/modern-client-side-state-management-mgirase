import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { CartItem, Product } from '../types';

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'added'; product: Product }
  | { type: 'removed'; id: string }
  | { type: 'cleared' };

/**
 * Pure reducer function handling item addition and removal.
 * Immutably manages cart items array and quantities.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'added': {
      const existing = state.items.find((item) => item.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.product.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      return {
        items: [...state.items, { ...action.product, qty: 1 }],
      };
    }

    case 'removed':
      return {
        items: state.items.filter((item) => item.id !== action.id),
      };

    case 'cleared':
      return {
        items: [],
      };

    default:
      throw new Error(`Unhandled action type: ${(action as { type: string }).type}`);
  }
}

// Separate contexts to optimize render performance
export const CartStateContext = createContext<CartState | null>(null);
export const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

/**
 * Safety-guarded custom hook for accessing cart state.
 * Throws explicit error when called outside CartProvider.
 */
export function useCartState(): CartState {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error('useCartState must be used within <CartProvider>');
  }
  return context;
}

/**
 * Safety-guarded custom hook for accessing cart dispatch.
 * Throws explicit error when called outside CartProvider.
 */
export function useCartDispatch(): Dispatch<CartAction> {
  const context = useContext(CartDispatchContext);
  if (!context) {
    throw new Error('useCartDispatch must be used within <CartProvider>');
  }
  return context;
}

