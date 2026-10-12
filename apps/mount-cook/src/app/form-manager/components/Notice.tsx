import type { ReactNode } from 'react';

export default function Notice({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="p-5 text-sm text-slate-500">
      {children}
    </p>
  );
}
