import { createMappingSlice } from 'np-westland/slices';
import { createStore } from 'zustand/vanilla';

type MappingSlice = ReturnType<typeof createMappingSlice>;
type Store = MappingSlice;

const store = createStore<Store>()((...args) => ({
  ...createMappingSlice(...args),
}));

export default store;
