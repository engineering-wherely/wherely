import useMappingService from '@/features/mapping/hooks/useMappingService';
import useMappingStore from '@/features/mapping/hooks/useMappingStore';
import { useEffect } from 'react';

export function useGeocoding() {
  const service = useMappingService();
  const location = useMappingStore((s) => s.location);
  const setLocation = useMappingStore((s) => s.setLocation);
  const result = useMappingStore((s) => s.result);
  const setResult = useMappingStore((s) => s.setResult);

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
  }, [service, location, setResult]);

  return {
    location,
    setLocation,
    result,
  };
}
