import '@/features/mapping/components/GetStartedControl.css';
import { useOlMap } from '@/features/mapping/hooks/useOlMap';
import { cn } from '@/shadcn-ui/lib/utils';
import type { Nullable } from '@/types/common';
import type { Options as ControlOptions } from 'ol/control/Control';
import Control from 'ol/control/Control';
import { type ButtonHTMLAttributes, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type GetStartedControlProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  firstName: string;
  lastName: string;
  target?: ControlOptions['target'];
};

function getInitial(value: string) {
  return Array.from(value.trim()).at(0)?.toLocaleUpperCase() ?? '';
}

export function GetStartedControl({
  firstName,
  lastName,
  className,
  target,
  'aria-label': ariaLabel,
  ...props
}: GetStartedControlProps) {
  const map = useOlMap();
  const [element, setElement] = useState<Nullable<HTMLDivElement>>(null);
  const initials = `${getInitial(firstName)}${getInitial(lastName)}`;
  const fullName = `${firstName} ${lastName}`.trim();

  useEffect(() => {
    if (!map) {
      return;
    }

    const element = document.createElement('div');
    element.className = 'ol-unselectable np-westland-get-started-control';
    element.style.pointerEvents = 'auto';

    const control = new Control({ element, target });
    map.addControl(control);
    setElement(element);

    return () => {
      map.removeControl(control);
      setElement(null);
    };
  }, [map, target]);

  if (!element) {
    return null;
  }

  return createPortal(
    <button
      type='button'
      aria-label={ariaLabel ?? (fullName ? `Get started as ${fullName}` : 'Get started')}
      className={cn(
        'flex size-12 items-center justify-center rounded-full border border-border bg-primary text-base font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {initials}
    </button>,
    element
  );
}

export default GetStartedControl;
