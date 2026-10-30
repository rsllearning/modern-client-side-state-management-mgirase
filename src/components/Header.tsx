import { Toolbar } from './Toolbar';
import { CartBadge } from './CartBadge';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-300 p-4 mb-6 shadow-xs">
      <Toolbar>
        <CartBadge />
      </Toolbar>
    </header>
  );
}
