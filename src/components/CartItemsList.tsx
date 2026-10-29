import { useCartState, useCartDispatch } from '../context/CartContext';

export function CartItemsList() {
  const { items } = useCartState();
  const dispatch = useCartDispatch();

  if (items.length === 0) {
    return <p className="text-gray-500 text-sm">Your cart is empty.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {items.map((item) => (
        <li key={item.id} className="py-2 flex items-center justify-between text-sm">
          <div>
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-500 ml-2">
              (${item.price} &times; {item.qty} = ${item.price * item.qty})
            </span>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'removed', id: item.id })}
            className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded border border-red-200 hover:bg-red-50 cursor-pointer ml-3"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
