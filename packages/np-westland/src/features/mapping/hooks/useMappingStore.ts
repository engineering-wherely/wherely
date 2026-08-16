import MappingContext from '@/features/mapping/contexts/MappingContext';
import type { MappingSlice } from '@/features/mapping/stores/createMappingSlice';
import { useContext } from 'react';
import { useStore } from 'zustand';

const useMappingStore = <T>(selector: (state: MappingSlice) => T): T => {
  const value = useContext(MappingContext);
  if (!value) {
    throw new Error(`useMappingStore must be used within MappingContextProvider`);
  }

  return useStore(value.store, selector);
};

export default useMappingStore;
