import MappingContext from '@/features/mapping/contexts/MappingContext';
import type MappingService from '@/features/mapping/services/MappingService';
import { useContext } from 'react';

const useMappingService = (): MappingService => {
  const value = useContext(MappingContext);
  if (!value) {
    throw new Error(`useMappingService must be used within MappingContextProvider`);
  }

  return value.service;
};

export default useMappingService;
