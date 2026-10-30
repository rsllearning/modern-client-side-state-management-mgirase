import { useAtomValue, useSetAtom } from 'jotai';
import {
  cartItemsAtom,
  cartTotalAtom,
  checkoutStatusAtom,
  checkoutErrorAtom,
  orderResultAtom,
  checkoutAtom,
} from '../atoms/cartAtoms';
import { CartItemsList } from './CartItemsList';

export function CartDrawer() {
  const items = useAtomValue(cartItemsAtom);
  const total = useAtomValue(cartTotalAtom);
  const status = useAtomValue(checkoutStatusAtom);
  const errorMessage = useAtomValue(checkoutErrorAtom);
  const orderResult = useAtomValue(orderResultAtom);
  const checkout = useSetAtom(checkoutAtom);

  const isSubmitting = status === 'submitting';

  return (
    <aside className="border border-gray-300 rounded p-4 bg-white">
      <h2 className="text-lg font-bold mb-3">Cart Drawer</h2>

      {status === 'success' && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded">
          <p className="font-medium">Order placed successfully!</p>
          {orderResult?.id && (
            <p className="mt-0.5 text-green-800 font-mono text-[11px]">
              Order ID: #{orderResult.id}
            </p>
          )}
        </div>
      )}

      {status === 'error' && errorMessage && (
        <p className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {errorMessage}
        </p>
      )}

      <CartItemsList />

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="font-semibold text-base">Total: ${total}</span>
        <button
          type="button"
          disabled={items.length === 0 || isSubmitting}
          onClick={() => checkout()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-1.5 px-4 rounded cursor-pointer"
        >
          {isSubmitting ? 'Checking out...' : 'Checkout'}
        </button>
      </div>
    </aside>
  );
}
