import type { CartItem } from '../types';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  items?: CartItem[];
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export function CartDrawer({
  items = [],
  onRemoveItem,
  onCheckout,
  isCheckingOut = false,
}: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <aside className="border border-gray-300 rounded p-4 bg-white shadow-xs">
      <h2 className="text-lg font-bold mb-3">Cart Drawer</h2>
      <CartItemsList items={items} onRemoveItem={onRemoveItem} />

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="font-semibold text-base">Total: ${total}</span>
        <button
          type="button"
          disabled={items.length === 0 || isCheckingOut}
          onClick={onCheckout}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-1.5 px-4 rounded cursor-pointer"
        >
          {isCheckingOut ? 'Checking out...' : 'Checkout'}
        </button>
      </div>
    </aside>
  );
}
