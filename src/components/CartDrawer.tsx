import { CartItemsList } from './CartItemsList';
import { useCartState } from '../context/CartContext';

export function CartDrawer() {
  const { items } = useCartState();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    alert(`Checkout initiated for ${items.length} items. Total: $${total}`);
  };

  return (
    <aside className="border border-gray-300 rounded p-4 bg-white">
      <h2 className="text-lg font-bold mb-3">Cart Drawer</h2>
      <CartItemsList />

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="font-semibold text-base">Total: ${total}</span>
        <button
          type="button"
          disabled={items.length === 0}
          onClick={handleCheckout}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-1.5 px-4 rounded cursor-pointer"
        >
          Checkout
        </button>
      </div>
    </aside>
  );
}
