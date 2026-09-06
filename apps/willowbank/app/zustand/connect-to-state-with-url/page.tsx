"use client";

import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const getUrlSearch = () => {
  return window.location.search.slice(1);
};

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch());
      const storedValue = searchParams.get(key);
      return JSON.parse(storedValue as string);
    } else {
      return JSON.parse(localStorage.getItem(key) as string);
    }
  },
  setItem: (key, newValue): void => {
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch());
      searchParams.set(key, JSON.stringify(newValue));
      window.history.replaceState(null, "", `?${searchParams.toString()}`);
    }
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.delete(key);
    window.location.search = searchParams.toString();
  },
};

type LocalAndUrlStore = {
  typesOfFish: string[];
  addTypeOfFish: (fishType: string) => void;
  numberOfBears: number;
  setNumberOfBears: (newNumber: number) => void;
};

const storageOptions = {
  name: "fishAndBearsStore",
  storage: createJSONStorage<LocalAndUrlStore>(() => persistentStorage),
};

export const useLocalAndUrlStore = create<LocalAndUrlStore>()(
  persist<LocalAndUrlStore>(
    (set) => ({
      typesOfFish: [],
      addTypeOfFish: (fishType) =>
        set((state) => ({ typesOfFish: [...state.typesOfFish, fishType] })),
      numberOfBears: 0,
      setNumberOfBears: (numberOfBears) => set(() => ({ numberOfBears })),
    }),
    storageOptions,
  ),
);

const buildURLSuffix = (params, version = 0) => {
  const searchParams = new URLSearchParams();

  const zustandStoreParams = {
    state: {
      typesOfFish: params.typesOfFish,
      numberOfBears: params.numberOfBears,
    },
    version,
  };

  searchParams.set("fishAndBearsStore", JSON.stringify(zustandStoreParams));
  return searchParams.toString();
};

const buildShareableUrl = (params, version) => {
  return `${window.location.origin}?${buildURLSuffix(params, version)}`;
};

export default function Page() {
  const typesOfFish = useLocalAndUrlStore((state) => state.typesOfFish);
  const numberOfBears = useLocalAndUrlStore((state) => state.numberOfBears);
  const addTypeOfFish = useLocalAndUrlStore((state) => state.addTypeOfFish);
  const setNumberOfBears = useLocalAndUrlStore(
    (state) => state.setNumberOfBears,
  );

  const handleAddTypeOfFishClick = () => {
    addTypeOfFish("Tuna");
  };

  const handleSetNumberOfBearsClick = () => {
    setNumberOfBears(2);
  };

  return (
    <div>
      <button onClick={handleAddTypeOfFishClick}>Add type of fish</button>
      <button onClick={handleSetNumberOfBearsClick}>Set number of bears</button>
      <div>Types of fish: {typesOfFish}</div>
      <div>Number of bears: {numberOfBears}</div>
    </div>
  );
}
