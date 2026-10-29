import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-base mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">${product.price}</p>
      </div>
      <button
        type="button"
        onClick={() => onAddToCart?.(product)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
}
