import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { CheckoutContext } from '../context/CheckoutContext';

/**
 * Headless Bridge: Store -> Machine
 * Listens to Zustand cart changes and syncs them into the running machine
 * so that the machine always processes the latest cart items.
 */
export function CartSynchronizer() {
  const items = useCartStore((s) => s.items);
  const actorRef = CheckoutContext.useActorRef();

  useEffect(() => {
    actorRef.send({ type: 'SYNC_ITEMS', items });
  }, [items, actorRef]);

  return null;
}

