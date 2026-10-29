import type { ReactNode } from 'react';
import { Toolbar } from './Toolbar';

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-300 p-4 mb-6 shadow-xs">
      <Toolbar>{children}</Toolbar>
    </header>
  );
}
