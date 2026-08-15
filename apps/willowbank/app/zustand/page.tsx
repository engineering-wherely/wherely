"use client";

import { create } from "zustand";
import { useSyncExternalStore } from "react";

const useBear = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));

export default function Page() {
  return (
    <div>
      <BearCounter />
      <Controls />
      <div className="mt-1">
        <Counter />
      </div>
    </div>
  );
}

function BearCounter() {
  const bears = useBear((state) => state.bears);
  return <h1>{bears} bears around here...</h1>;
}

function Controls() {
  const increasePopulation = useBear((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}

let count = 0;
const listeners = new Set<() => void>();
const store = {
  getSnapshot: () => count,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  increment: () => {
    count += 1;
    listeners.forEach((listener) => listener());
  },
};

function Counter() {
  const count = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return <button onClick={store.increment}>{count}</button>;
}
