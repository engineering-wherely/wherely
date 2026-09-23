import '@/features/mapping/components/Controls.css';
import { ControlsContext } from '@/features/mapping/contexts/ControlsContext';
import { useOlMap } from '@/features/mapping/hooks/useOlMap';
import { cn } from '@/shadcn-ui/lib/utils';
import type { Nullable } from '@/types/common';
import Control from 'ol/control/Control';
import { type ReactNode, useEffect, useState } from 'react';

export type ControlsProps = {
  children?: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
};

export function Controls({ children, position = 'top-right', className }: ControlsProps) {
  const map = useOlMap();
  const [element, setElement] = useState<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const element = document.createElement('div');
    element.style.pointerEvents = 'none';
    const control = new Control({ element });
    map.addControl(control);
    setElement(element);

    return () => {
      map.removeControl(control);
      setElement(null);
    };
  }, [map]);

  useEffect(() => {
    if (!element) {
      return;
    }

    element.className = cn('np-westland-controls', className);
    element.dataset.position = position;
  }, [element, position, className]);

  if (!element) {
    return null;
  }

  return <ControlsContext value={element}>{children}</ControlsContext>;
}

export default Controls;
