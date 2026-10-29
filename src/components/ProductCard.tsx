import { memo } from 'react';
import type { Product } from '../types';
import { useCartDispatch } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const dispatch = useCartDispatch();

  const handleAddToCart = () => {
    dispatch({ type: 'added', product });
  };

  return (
    <div className="border border-gray-300 rounded p-4 bg-white flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-base mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">${product.price}</p>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
});
