import MappingContext from '@/features/mapping/contexts/MappingContext';
import type MappingService from '@/features/mapping/services/MappingService';
import { MappingSlice } from '@/features/mapping/stores/createMappingSlice';
import { ReactNode } from 'react';
import { StoreApi } from 'zustand';

export interface MappingContextProviderProps {
  service: MappingService;
  store: StoreApi<MappingSlice>;
  children: ReactNode;
}

export const MappingContextProvider = ({
  service,
  store,
  children,
}: MappingContextProviderProps) => {
  return <MappingContext value={{ service, store }}>{children}</MappingContext>;
};
