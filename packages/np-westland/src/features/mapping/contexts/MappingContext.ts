import type MappingService from '@/features/mapping/services/MappingService';
import type { MappingSlice } from '@/features/mapping/stores/createMappingSlice';
import type { Optional } from '@/types';
import { createContext } from 'react';
import type { StoreApi } from 'zustand';

const MappingContext = createContext<
  Optional<{
    service: MappingService;
    store: StoreApi<MappingSlice>;
  }>
>(undefined);

export default MappingContext;
