'use client';

import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

export default function Split({
  first,
  second,
  vertical = false,
  initial = 35,
  label,
}: {
  first: ReactNode;
  second: ReactNode;
  vertical?: boolean;
  initial?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(initial);
  const clamp = (value: number) => Math.max(20, Math.min(80, value));
  return (
    <div
      ref={ref}
      className={`flex h-full min-h-0 min-w-0 ${vertical ? 'flex-col' : ''}`}
    >
      <div
        className="min-h-0 min-w-0 overflow-hidden"
        style={{ flex: `0 0 ${size}%` }}
      >
        {first}
      </div>
      <div
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-orientation={vertical ? 'horizontal' : 'vertical'}
        aria-valuemin={20}
        aria-valuemax={80}
        aria-valuenow={Math.round(size)}
        className={`shrink-0 bg-slate-100 hover:bg-indigo-200 focus:bg-indigo-300 focus:outline-none ${vertical ? 'h-2 cursor-row-resize' : 'w-2 cursor-col-resize'}`}
        style={{ touchAction: 'none' }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (
            !event.currentTarget.hasPointerCapture(event.pointerId) ||
            !ref.current
          ) {
            return;
          }
          const bounds = ref.current.getBoundingClientRect();
          setSize(
            clamp(
              vertical
                ? ((event.clientY - bounds.top) / bounds.height) * 100
                : ((event.clientX - bounds.left) / bounds.width) * 100
            )
          );
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onKeyDown={(event) => {
          const decrease = vertical ? 'ArrowUp' : 'ArrowLeft';
          const increase = vertical ? 'ArrowDown' : 'ArrowRight';
          if (event.key === decrease || event.key === increase) {
            event.preventDefault();
            setSize(clamp(size + (event.key === decrease ? -2 : 2)));
          }
        }}
      />
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{second}</div>
    </div>
  );
}
