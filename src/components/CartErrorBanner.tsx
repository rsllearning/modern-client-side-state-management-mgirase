import { CheckoutContext } from '../context/CheckoutContext';

/**
 * Granular Leaf Component: Subscribes specifically to the machine's error message.
 * Only re-renders when context.errorMessage changes.
 */
export function CartErrorBanner() {
  const errorMessage = CheckoutContext.useSelector(
    (s) => s.context.errorMessage
  );

  if (!errorMessage) return null;

  return (
    <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
      {errorMessage}
    </div>
  );
}

