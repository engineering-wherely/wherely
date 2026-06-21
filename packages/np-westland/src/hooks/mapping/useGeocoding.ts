import { useMappingService, useMappingStore } from '@/contexts/mapping/MappingContext';
import { useEffect } from 'react';

export function useGeocoding() {
  const service = useMappingService();
  const { location, setLocation, result, setResult } = useMappingStore((s) => ({
    location: s.location,
    setLocation: s.setLocation,
    result: s.result,
    setResult: s.setResult,
  }));

  useEffect(() => {
    async function startFetching() {
      setResult([]);

      if (!location) {
        return;
      }

      const _result = await service.geocode(location);
      if (!ignore) {
        setResult(_result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, [service, location]);

  return {
    location,
    setLocation,
    result,
  };
}
