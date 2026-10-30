import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { CheckoutContext } from '../context/CheckoutContext';

/**
 * Headless Bridge: Machine -> Store
 * Listens to the machine's emitted orderSuccess event to clear the active
 * Zustand store without coupling store mutations inside machine definitions.
 */
export function OrderCompletionBridge() {
  const clear = useCartStore((s) => s.clear);
  const actorRef = CheckoutContext.useActorRef();

  useEffect(() => {
    // Listen to emitted events without polluting machine context
    const sub = actorRef.on('orderSuccess', (event) => {
      console.log(`Order ${event.orderId} succeeded! Clearing Zustand cart...`);
      clear();
    });

    return () => sub.unsubscribe();
  }, [actorRef, clear]);

  return null;
}

