import { useEffect, useRef } from 'react';

export default function usePrevious<T>(value: T): T | undefined {
  const previousRef = useRef<T>(undefined);

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
}
