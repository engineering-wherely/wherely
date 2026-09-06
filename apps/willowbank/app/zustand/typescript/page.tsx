"use client";

import { create, type ExtractState } from "zustand";
import { combine } from "zustand/middleware";

const initialState = { bears: 0, food: "honey" };

type BearState = typeof initialState & {
  increase: (by: number) => void;
  reset: () => void;
};

export const useBearStore = create<BearState>()((set) => ({
  ...initialState,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  reset: () => set(initialState),
}));

function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} bears around</h1>;
}

function ResetZoo() {
  const { bears, increase, reset } = useBearStore();

  return (
    <div>
      <div>{bears}</div>
      <button onClick={() => increase(5)}>Increase by 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

const useBeeStore = create(
  combine({ bees: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bees: state.bees + by })),
  })),
);

type BeeState = ExtractState<typeof useBeeStore>;

interface SnakeState {
  snakes: number;
  increase: (by: number) => void;
}

const useSnakeStore = create<SnakeState>()((set) => ({
  snakes: 0,
  increase: (by) => set((state) => ({ snakes: state.snakes + 1 })),
}));

useSnakeStore.setState({ snakes: 6 });

// declare const withError: <T, E>(
//   p: Promise<T>,
// ) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>;
declare const withError: {
  <E>(): <T>(
    p: Promise<T>,
  ) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>;
  <T, E>(
    p: Promise<T>,
  ): Promise<[error: undefined, value: T] | [error: E, value: undefined]>;
};
declare const doSometing: () => Promise<string>;
interface Foo {
  bar: string;
}

const main = async () => {
  let [error, value] = await withError<Foo>()(doSometing());
};

// An implementation of withError
// type WithErrorResult<T, E> =
//   | [error: undefined, value: T]
//   | [error: E, value: undefined]

// function withError<E>(): <T>(p: Promise<T>) => Promise<WithErrorResult<T, E>>
// function withError<T, E>(p: Promise<T>): Promise<WithErrorResult<T, E>>
// function withError<T, E>(p?: Promise<T>) {
//   const run = async (promise: Promise<T>): Promise<WithErrorResult<T, E>> => {
//     try {
//       const value = await promise
//       return [undefined, value]
//     } catch (error) {
//       return [error as E, undefined]
//     }
//   }

//   if (p) {
//     return run(p)
//   }

//   return run
// }

export default function Page() {
  return (
    <div>
      <BearCounter />
      <ResetZoo />
    </div>
  );
}
