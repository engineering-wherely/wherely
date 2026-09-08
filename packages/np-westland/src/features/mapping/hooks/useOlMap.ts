import { OlMapContext } from '@/features/mapping/contexts/OlMapContext';
import { useContext } from 'react';

export function useOlMap() {
  return useContext(OlMapContext);
}
