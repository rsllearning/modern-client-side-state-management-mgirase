import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogProps {
  onAddToCart?: (product: Product) => void;
}

export function Catalog({ onAddToCart }: CatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/products', { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to fetch catalog: ${res.status} ${res.statusText}`);
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-4">Products</h2>

      {loading && <p className="text-gray-500">Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
