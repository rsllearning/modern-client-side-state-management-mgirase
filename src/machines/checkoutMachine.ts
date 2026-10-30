import { setup, assign, fromPromise, emit } from 'xstate';
import type { CartItem, CheckoutResult } from '../types';

export const checkoutMachine = setup({
  types: {
    context: {} as {
      items: CartItem[];
      errorMessage: string | null;
      orderResult: CheckoutResult | null;
    },
    events: {} as
      | { type: 'SUBMIT' }
      | { type: 'CANCEL' }
      | { type: 'SYNC_ITEMS'; items: CartItem[] }
      | { type: 'RESET' },
    input: {} as {
      initialItems: CartItem[];
    },
    output: {} as CheckoutResult,
    emitted: {} as { type: 'orderSuccess'; orderId: string },
  },
  guards: {
    // Pure predicate: prevents payment submission if cart is empty
    hasItems: ({ context }) => context.items.length > 0,
  },
  actors: {
    // Asynchronous payment actor with native browser AbortSignal
    chargePaymentGateway: fromPromise(
      async ({
        input,
        signal,
      }: {
        input: { items: CartItem[] };
        signal: AbortSignal;
      }): Promise<CheckoutResult> => {
        const total = input.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: input.items,
            total,
            createdAt: new Date().toISOString(),
          }),
          // Native AbortSignal: cancels in-flight fetch immediately if submitting state exits
          signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({
            message: 'Payment authorization declined',
          }));
          throw new Error(err.message || 'Payment failed');
        }

        return response.json();
      }
    ),
  },
}).createMachine({
  id: 'checkout',
  initial: 'review',
  context: ({ input }) => ({
    items: input.initialItems,
    errorMessage: null,
    orderResult: null,
  }),
  states: {
    // Mode A: Customer reviews cart items
    review: {
      on: {
        SUBMIT: {
          target: 'submitting',
          guard: 'hasItems',
        },
        SYNC_ITEMS: {
          actions: assign({
            items: ({ event }) => event.items,
            errorMessage: null,
          }),
        },
      },
    },

    // Mode B: Payment submission in flight
    submitting: {
      invoke: {
        id: 'paymentProcessor',
        src: 'chargePaymentGateway',
        input: ({ context }) => ({ items: context.items }),
        onDone: {
          target: 'success',
          actions: assign({
            orderResult: ({ event }) => event.output,
            errorMessage: null,
          }),
        },
        onError: {
          target: 'review',
          actions: assign({
            errorMessage: ({ event }) =>
              (event.error as Error).message || 'Payment failed',
          }),
        },
      },
      on: {
        // Customer can cancel mid-flight; exiting submitting automatically aborts fetch!
        CANCEL: { target: 'review' },
      },
    },

    // Mode C: Order success state
    success: {
      entry: emit(({ context }) => ({
        type: 'orderSuccess',
        orderId: context.orderResult?.id ?? '',
      })),
      on: {
        // When new items are added to cart, transition back to review mode
        SYNC_ITEMS: {
          target: 'review',
          actions: assign({
            items: ({ event }) => event.items,
            orderResult: null,
            errorMessage: null,
          }),
        },
        RESET: {
          target: 'review',
          actions: assign({
            orderResult: null,
            errorMessage: null,
          }),
        },
      },
    },
  },
});
