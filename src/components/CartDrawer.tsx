import { useCartStore, selectCartTotal } from '../store/cartStore';
import { CartItemsList } from './CartItemsList';
import { CartErrorBanner } from './CartErrorBanner';
import { CheckoutButton } from './CheckoutButton';

export function CartDrawer() {
  const total = useCartStore(selectCartTotal);

  return (
    <aside className="border border-gray-300 rounded p-4 bg-white">
      <h2 className="text-lg font-bold mb-3">Cart Drawer</h2>

      {/* Granular leaf: error banner */}
      <CartErrorBanner />

      {/* Cart items list */}
      <CartItemsList />

      {/* Subtotal and declarative checkout button */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-base">Total: ${total}</span>
        </div>
        <CheckoutButton />
      </div>
    </aside>
  );
}
