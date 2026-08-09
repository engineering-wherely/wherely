import { MappingContext } from '@/features/mapping/contexts/MappingContext';
import type { MappingService } from '@/features/mapping/services/service';
import { createMappingStore } from '@/features/mapping/stores/store';
import { ReactNode, useState } from 'react';

export interface MappingContextProviderProps {
  service: MappingService;
  children: ReactNode;
}

export const MappingContextProvider = ({ service, children }: MappingContextProviderProps) => {
  const [store] = useState(() => createMappingStore());
  return <MappingContext value={{ service, store }}>{children}</MappingContext>;
};
