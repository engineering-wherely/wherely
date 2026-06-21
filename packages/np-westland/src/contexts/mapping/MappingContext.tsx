import type { MappingService } from '@/services/mapping/service';
import type { MappingStore, MappingStoreApi } from '@/stores/mapping/store';
import type { Optional } from '@/types';
import { createContext, useContext } from 'react';
import { useStore } from 'zustand';

export const MappingContext = createContext<
  Optional<{
    service: MappingService;
    store: MappingStoreApi;
  }>
>(undefined);

export const useMappingService = (): MappingService => {
  const value = useContext(MappingContext);
  if (!value) {
    throw new Error(`useMappingService must be used within MappingContextProvider`);
  }

  return value.service;
};

export const useMappingStore = <T,>(selector: (store: MappingStore) => T): T => {
  const value = useContext(MappingContext);
  if (!value) {
    throw new Error(`useMappingStore must be used within MappingContextProvider`);
  }

  return useStore(value.store, selector);
};
