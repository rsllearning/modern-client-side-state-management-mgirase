interface CartBadgeProps {
  count?: number;
}

export function CartBadge({ count = 0 }: CartBadgeProps) {
  return (
    <span className="font-semibold text-sm bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
      Cart: <strong>{count}</strong> {count === 1 ? 'item' : 'items'}
    </span>
  );
}
