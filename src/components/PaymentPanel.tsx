import { CheckoutContext } from '../context/CheckoutContext';

/**
 * Sibling component sharing the exact same checkout actor.
 * Displays workflow status, error messages, and triggers ("Submit Payment", "Cancel").
 */
export function PaymentPanel() {
  const actorRef = CheckoutContext.useActorRef();

  // Fine-grained subscriptions via useSelector
  const isSubmitting = CheckoutContext.useSelector((s) =>
    s.matches('submitting')
  );
  const isSuccess = CheckoutContext.useSelector((s) => s.matches('success'));
  const canSubmit = CheckoutContext.useSelector((s) =>
    s.can({ type: 'SUBMIT' })
  );
  const errorMessage = CheckoutContext.useSelector(
    (s) => s.context.errorMessage
  );
  const orderResult = CheckoutContext.useSelector(
    (s) => s.context.orderResult
  );

  return (
    <div className="border border-gray-300 rounded p-4 bg-white mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-base">Payment Panel</h3>
        <span
          className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
            isSubmitting
              ? 'bg-yellow-100 text-yellow-800'
              : isSuccess
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {isSubmitting ? 'submitting' : isSuccess ? 'success' : 'review'}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Multi-step checkout orchestrated via XState v5 state machine.
      </p>

      {/* Terminal success display */}
      {isSuccess && (
        <div className="mb-3 p-2.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded">
          <p className="font-semibold">Order placed successfully!</p>
          {orderResult?.id && (
            <p className="font-mono text-[11px] mt-0.5 text-green-800">
              Order ID: #{orderResult.id}
            </p>
          )}
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {errorMessage}
        </div>
      )}

      {/* Processing indicator */}
      {isSubmitting && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded animate-pulse">
          Payment authorization in progress with json-server...
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!canSubmit || isSubmitting}
          onClick={() => actorRef.send({ type: 'SUBMIT' })}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium py-1.5 px-3 rounded cursor-pointer transition-colors"
        >
          {isSubmitting ? 'Authorizing...' : 'Submit Payment'}
        </button>

        {isSubmitting && (
          <button
            type="button"
            onClick={() => actorRef.send({ type: 'CANCEL' })}
            className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium py-1.5 px-3 rounded cursor-pointer transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
