"use client";

import { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }
  return store;
};

interface BearState {
  bears: number;
  increase: (by: number) => void;
  increment: () => void;
}

const useBearStoreBase = create<BearState>()((set, get) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  // increment: () => set((state) => ({ bears: state.bears + 1 })),
  increment: () => get().increase(1),
}));

const useBearStore = createSelectors(useBearStoreBase);

function BearStoreView() {
  const bears = useBearStore.use.bears();
  const increment = useBearStore.use.increment();

  return (
    <div>
      <div>Bears: {bears}</div>
      <button onClick={() => increment()}>Increment</button>
    </div>
  );
}

export default function Page() {
  return <BearStoreView />;
}
