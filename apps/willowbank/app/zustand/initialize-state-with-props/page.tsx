"use client";

import { createStore, useStore } from "zustand";
import { createContext, useState, useContext } from "react";

interface BearProps {
  bears: number;
}

interface BearState extends BearProps {
  addBear: () => void;
}

type BearStore = ReturnType<typeof createBearStore>;

const createBearStore = (initProps?: Partial<BearProps>) => {
  const DEFAULT_PROPS: BearProps = {
    bears: 0,
  };
  return createStore<BearState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    addBear: () => set((state) => ({ bears: ++state.bears })),
  }));
};

const BearContext = createContext<BearStore | null>(null);

function App() {
  const [store] = useState(() => createBearStore());
  return (
    <BearContext value={store}>
      <BasicConsumer />
    </BearContext>
  );
}

function App2() {
  return (
    <BearProvider bears={5}>
      <CommonConsumer />
    </BearProvider>
  );
}

function BasicConsumer() {
  const store = useContext(BearContext);
  if (!store) {
    throw new Error("Missing BearContext.Provider in the tree");
  }

  const bears = useStore(store, (s) => s.bears);
  const addBear = useStore(store, (s) => s.addBear);

  return (
    <>
      <div> {bears} Bears.</div>
      <button onClick={addBear}>Add bear</button>
    </>
  );
}

type BearProviderProps = React.PropsWithChildren<BearProps>;

function BearProvider({ children, ...props }: BearProviderProps) {
  const [store] = useState(() => createBearStore(props));
  return <BearContext value={store}>{children}</BearContext>;
}

function useBearContext<T>(selector: (state: BearState) => T): T {
  const store = useContext(BearContext);
  if (!store) {
    throw new Error("Missing BearContext.Provider in the tree");
  }
  return useStore(store, selector);
}

function CommonConsumer() {
  const bears = useBearContext((s) => s.bears);
  const addBear = useBearContext((s) => s.addBear);
  return (
    <>
      <div>{bears} Bears.</div>
      <button onClick={addBear}>Add bear</button>
    </>
  );
}

export default function Page() {
  return <App2 />;
}
