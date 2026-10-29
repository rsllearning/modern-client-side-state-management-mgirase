import type { ReactNode } from 'react';

interface ToolbarProps {
  children?: ReactNode;
}

export function Toolbar({ children }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold">ShopCart</h1>
      {children}
    </div>
  );
}
