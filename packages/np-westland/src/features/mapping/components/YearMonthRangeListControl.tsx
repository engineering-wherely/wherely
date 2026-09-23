import type { YearMonthRange } from '@/features/forms/year-month-range/types';
import { formatYearMonth, sortYearMonthRanges } from '@/features/forms/year-month-range/utils';
import '@/features/mapping/components/YearMonthRangeListControl.css';
import { ControlsContext } from '@/features/mapping/contexts/ControlsContext';
import { useOlMap } from '@/features/mapping/hooks/useOlMap';
import { Button } from '@/shadcn-ui/components/ui/button';
import type { Nullable } from '@/types/common';
import Control, { type Options as ControlOptions } from 'ol/control/Control';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type YearMonthRangeListControlProps = {
  ranges: readonly YearMonthRange[];
  isPending?: boolean;
  isFetching?: boolean;
  error?: Nullable<string>;
  target?: ControlOptions['target'];
};

export function YearMonthRangeListControl({
  ranges,
  isPending = false,
  isFetching = false,
  error,
  target,
}: YearMonthRangeListControlProps) {
  const map = useOlMap();
  const controlsTarget = useContext(ControlsContext);
  const controlTarget = target ?? controlsTarget ?? undefined;
  const [element, setElement] = useState<Nullable<HTMLDivElement>>(null);
  const yearMonthRanges = sortYearMonthRanges(ranges);

  useEffect(() => {
    if (!map) {
      return;
    }

    const element = document.createElement('div');
    element.className = 'ol-unselectable np-westland-year-month-range-list-control';
    element.style.pointerEvents = 'auto';

    const control = new Control({ element, target: controlTarget });
    map.addControl(control);
    setElement(element);

    return () => {
      map.removeControl(control);
      setElement(null);
    };
  }, [map, controlTarget]);

  if (!element) {
    return null;
  }

  return createPortal(
    <section
      aria-label='Year month ranges'
      aria-busy={isFetching}
      className='rounded-xl border border-slate-200 bg-white/95 px-2 py-3 text-xs text-slate-900 shadow-md backdrop-blur-sm'
    >
      {isPending ? (
        <p
          role='status'
          className='text-slate-500'
        >
          Loading…
        </p>
      ) : error ? (
        <p
          role='alert'
          className='max-w-40 break-words text-red-700'
        >
          An error has occurred: {error}
        </p>
      ) : yearMonthRanges.length === 0 ? (
        <p className='text-slate-500'>No year month ranges.</p>
      ) : (
        <ul className='flex flex-col gap-1'>
          {yearMonthRanges.map((range, index) => (
            <li
              key={`${range.start}-${range.end}-${index}`}
              className='border-b border-slate-200 last:border-0'
            >
              <Button
                type='button'
                variant='ghost'
                className='h-auto w-full flex-col gap-1 px-2 py-1 text-xs'
              >
                <span className='hidden whitespace-nowrap font-medium tabular-nums sm:inline'>
                  {formatYearMonth(range.start, 'full')} - {formatYearMonth(range.end, 'full')}
                </span>
                <span className='whitespace-nowrap font-medium tabular-nums sm:hidden'>
                  <span className='sr-only'>Start: </span>
                  {formatYearMonth(range.start)}
                </span>
                <span
                  aria-hidden='true'
                  className='h-1.5 w-px bg-slate-300 sm:hidden'
                />
                <span className='whitespace-nowrap font-medium tabular-nums sm:hidden'>
                  <span className='sr-only'>End: </span>
                  {formatYearMonth(range.end)}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>,
    element
  );
}

export default YearMonthRangeListControl;
