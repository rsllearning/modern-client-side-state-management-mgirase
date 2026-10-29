import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  return (
    <CartProvider>
      <div className="max-w-4xl mx-auto p-4">
        <Header />

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Catalog />
          </div>
          <div>
            <CartDrawer />
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
