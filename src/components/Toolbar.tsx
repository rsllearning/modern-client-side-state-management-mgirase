import type { ReactNode } from 'react';

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold">ShopCart</h1>
      {children}
    </div>
  );
}
