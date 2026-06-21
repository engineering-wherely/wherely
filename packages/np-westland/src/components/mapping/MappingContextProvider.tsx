import { MappingContext } from '@/contexts/mapping/MappingContext';
import type { MappingService } from '@/services/mapping/service';
import { createMappingStore } from '@/stores/mapping/store';
import { ReactNode, useState } from 'react';

export interface MappingContextProviderProps {
  service: MappingService,
  children: ReactNode
}

export const MappingContextProvider = ({service, children }: MappingContextProviderProps) => {
  const [store] = useState(() => createMappingStore())
  return (
    <MappingContext value={{service, store}}>
      {children}
    </MappingContext>
  )
}