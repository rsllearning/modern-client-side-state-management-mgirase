import { useState } from 'react';
import { Header } from './components/Header';
import { CartBadge } from './components/CartBadge';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';
import type { CartItem, Product } from './types';

export default function App() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header>
        <CartBadge count={count} />
      </Header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Catalog onAddToCart={addItem} />
        </div>
        <div>
          <CartDrawer items={items} onRemoveItem={removeItem} />
        </div>
      </main>
    </div>
  );
}
