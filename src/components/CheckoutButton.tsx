import { CheckoutContext } from '../context/CheckoutContext';

/**
 * Granular Leaf Component: Subscribes declaratively to the machine's transition capabilities.
 * Queries state.can({ type: 'SUBMIT' }) directly, avoiding hardcoded JSX validation rules.
 */
export function CheckoutButton() {
  const actorRef = CheckoutContext.useActorRef();
  const isSubmitting = CheckoutContext.useSelector((s) =>
    s.matches('submitting')
  );
  const canSubmit = CheckoutContext.useSelector((s) =>
    s.can({ type: 'SUBMIT' })
  );

  return (
    <div className="flex gap-2 w-full">
      <button
        type="button"
        disabled={!canSubmit || isSubmitting}
        onClick={() => actorRef.send({ type: 'SUBMIT' })}
        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-1.5 px-4 rounded cursor-pointer transition-colors"
      >
        {isSubmitting ? 'Placing Order...' : 'Pay Now'}
      </button>

      {isSubmitting && (
        <button
          type="button"
          onClick={() => actorRef.send({ type: 'CANCEL' })}
          className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium py-1.5 px-3 rounded cursor-pointer transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

