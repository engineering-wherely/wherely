"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  })),
);

export default function Page() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <div>
      <div>
        <div> Count: {count}</div>
        <button onClick={() => increment()}>Increment</button>
        <button onClick={() => useStore.devtools.cleanup()}> Cleanup</button>
      </div>
    </div>
  );
}
