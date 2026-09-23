import { Controls } from '@/features/mapping/components/Controls';
import { GetStartedControl } from '@/features/mapping/components/GetStartedControl';
import { YearMonthRangeListControl } from '@/features/mapping/components/YearMonthRangeListControl';
import { OlMapContext } from '@/features/mapping/contexts/OlMapContext';
import { render, within } from '@testing-library/react';
import OlMap from 'ol/Map';
import { StrictMode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
});

it('groups controls, updates their content, and cleans up in StrictMode', () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  const map = new OlMap({ controls: [] });
  const content = (firstName: string) => (
    <StrictMode>
      <OlMapContext value={map}>
        <Controls position='top-right'>
          <GetStartedControl
            firstName={firstName}
            lastName='Gong'
          />
          <YearMonthRangeListControl ranges={[{ start: '202104', end: '202604' }]} />
        </Controls>
      </OlMapContext>
    </StrictMode>
  );
  const { rerender, unmount } = render(content('Matthew'));
  const group = map.getOverlayContainerStopEvent().querySelector('.np-westland-controls');
  expect(group).toHaveAttribute('data-position', 'top-right');
  expect(group).toHaveStyle({ pointerEvents: 'none' });
  expect(group?.children).toHaveLength(2);
  expect(map.getControls().getLength()).toBe(3);
  expect(
    within(group as HTMLElement).getByRole('button', { name: 'Get started as Matthew Gong' })
  ).toBeTruthy();
  expect(within(group as HTMLElement).getByText('Apr 2021 - Apr 2026')).toBeTruthy();

  rerender(content('Matt'));
  expect(
    within(group as HTMLElement).getByRole('button', { name: 'Get started as Matt Gong' })
  ).toBeTruthy();
  expect(map.getControls().getLength()).toBe(3);

  unmount();
  expect(map.getControls().getLength()).toBe(0);
  expect(map.getOverlayContainerStopEvent().children).toHaveLength(0);
  map.dispose();
});
