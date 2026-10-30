import { useAtomValue } from 'jotai';
import { cartCountAtom } from '../atoms/cartAtoms';

export function CartBadge() {
  const count = useAtomValue(cartCountAtom);

  return (
    <span className="font-semibold text-sm bg-gray-100 px-3 py-1.5 rounded border border-gray-300">
      Cart: <strong>{count}</strong> {count === 1 ? 'item' : 'items'}
    </span>
  );
}
