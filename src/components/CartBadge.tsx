import { useCartState } from '../context/CartContext';

export function CartBadge() {
  const { items } = useCartState();
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <span className="font-semibold text-sm bg-gray-100 px-3 py-1.5 rounded border border-gray-300">
      Cart: <strong>{count}</strong> {count === 1 ? 'item' : 'items'}
    </span>
  );
}
