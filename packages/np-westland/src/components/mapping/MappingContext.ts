import type { Nullable } from '@/types';
import { createContext } from 'react';

export interface MappingService {
  geocode(location: string): Promise<unknown[]>;
}

export const MappingContext = createContext<Nullable<MappingService>>(null);
