import { CheckoutContext } from './context/CheckoutContext';
import { useCartStore } from './store/cartStore';
import { CartSynchronizer } from './components/CartSynchronizer';
import { OrderCompletionBridge } from './components/OrderCompletionBridge';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';
import { PaymentPanel } from './components/PaymentPanel';

export default function App() {
  const initialItems = useCartStore.getState().items;

  return (
    <CheckoutContext.Provider options={{ input: { initialItems } }}>
      <CartSynchronizer />
      <OrderCompletionBridge />

      <div className="max-w-4xl mx-auto p-4">
        <Header />

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Catalog />
          </div>
          <div>
            <CartDrawer />
            <PaymentPanel />
          </div>
        </main>
      </div>
    </CheckoutContext.Provider>
  );
}
