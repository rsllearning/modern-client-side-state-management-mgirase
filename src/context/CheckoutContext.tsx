import { createActorContext } from '@xstate/react';
import { checkoutMachine } from '../machines/checkoutMachine';

// Shared actor context across all sibling checkout components
export const CheckoutContext = createActorContext(checkoutMachine);

