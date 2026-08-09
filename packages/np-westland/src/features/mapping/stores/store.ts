import { createStore } from 'zustand/vanilla';

export type MappingState = {
  location: string;
  result: unknown[];
};

export type MappingActions = {
  setLocation: (location: string) => void;
  setResult: (result: unknown[]) => void;
};

export type MappingStore = MappingState & MappingActions;

export const defaultInitState: MappingState = {
  location: '',
  result: [],
};

export const createMappingStore = (initSate: MappingState = defaultInitState) => {
  return createStore<MappingStore>()((set) => ({
    ...initSate,
    setLocation: (location: string) => set({ location }),
    setResult: (result: unknown[]) => set({ result }),
  }));
};

export type MappingStoreApi = ReturnType<typeof createMappingStore>;
