import { StateCreator } from 'zustand';

export interface MappingSlice {
  location: string;
  result: unknown[];
  setLocation: (location: string) => void;
  setResult: (result: unknown[]) => void;
}

const createMappingSlice: StateCreator<MappingSlice, [], [], MappingSlice> = (set) => ({
  location: '',
  result: [],
  setLocation: (location) => set({ location }),
  setResult: (result) => set({ result }),
});

export default createMappingSlice;
