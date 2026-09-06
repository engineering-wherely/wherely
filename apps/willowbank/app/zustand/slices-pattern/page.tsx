"use client";

import { create } from "zustand";

const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
});

const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
});

const createBearFishSlice = (set, get) => ({
  addBearAndFish: () => {
    get().addBear();
    get().addFish();
  },
});

const useBoundStore = create((...a) => ({
  ...createFishSlice(...a),
  ...createBearSlice(...a),
  ...createBearFishSlice(...a),
}));

export default function Page() {
  const bears = useBoundStore((state) => state.bears);
  const fishes = useBoundStore((state) => state.fishes);
  const addBear = useBoundStore((state) => state.addBear);
  const addBearAndFish = useBoundStore((state) => state.addBearAndFish);

  return (
    <div>
      <h2>Number of bears: {bears}</h2>
      <h2>Number of fishes: {fishes}</h2>
      <button onClick={() => addBear()}>Add a bear</button>
      <button onClick={() => addBearAndFish()}>Add bear and fish</button>
    </div>
  );
}
