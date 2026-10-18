import { Popup } from '@/features/mapping/components/Popup';
import { OlMapContext } from '@/features/mapping/contexts/OlMapContext';
import type { Optional } from '@/types/common';
import { act, fireEvent, render, within } from '@testing-library/react';
import OlMap from 'ol/Map';
import { StrictMode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/features/mapping/components/Popup.css', () => ({}));
vi.mock('ol-ext/overlay/Popup.css', () => ({}));

afterEach(() => {
  vi.unstubAllGlobals();
});

it('opens after the first usable frame and stays closed after dismissal', () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  const map = new OlMap({ controls: [], layers: [] });
  const coordinate = vi.fn<() => Optional<number[]>>(() => undefined);
  const onOpenChange = vi.fn();
  const { unmount } = render(
    <StrictMode>
      <OlMapContext value={map}>
        <Popup
          coordinate={coordinate}
          onOpenChange={onOpenChange}
          updateOnPostRender
        >
          Welcome
        </Popup>
      </OlMapContext>
    </StrictMode>
  );
  const popup = map.getOverlays().item(0);
  expect(map.getOverlays().getLength()).toBe(1);
  expect(popup.getPosition()).toBeUndefined();

  coordinate.mockReturnValue([10, 20]);
  act(() => {
    map.dispatchEvent('postrender');
  });
  expect(popup.getPosition()).toEqual([10, 20]);
  expect(within(popup.getElement()!).getByText('Welcome')).toBeTruthy();

  const changed = vi.fn();
  popup.on('change:position', changed);
  act(() => {
    map.dispatchEvent('postrender');
  });
  expect(changed).not.toHaveBeenCalled();

  coordinate.mockReturnValue([30, 40]);
  act(() => {
    map.dispatchEvent('change:size');
  });
  expect(popup.getPosition()).toEqual([30, 40]);

  fireEvent.click(within(popup.getElement()!).getByLabelText('Close popup'));
  expect(onOpenChange).toHaveBeenCalledWith(false);
  act(() => {
    map.dispatchEvent('postrender');
  });
  expect(popup.getPosition()).toBeUndefined();

  unmount();
  expect(map.getOverlays().getLength()).toBe(0);
  map.dispose();
});

it('portals the close button, supports target changes, and preserves dismissal', () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  const map = new OlMap({ controls: [], layers: [] });
  const firstTarget = document.createElement('div');
  const secondTarget = document.createElement('div');
  const onOpenChange = vi.fn();
  const view = (target?: HTMLElement, showCloseButton = true) => (
    <OlMapContext value={map}>
      <Popup
        coordinate={[10, 20]}
        closeButtonTarget={target}
        showCloseButton={showCloseButton}
        onOpenChange={onOpenChange}
      >
        Welcome
      </Popup>
    </OlMapContext>
  );
  const { rerender, unmount } = render(view(firstTarget));
  const popup = map.getOverlays().item(0);
  expect(within(firstTarget).getByRole('button', { name: 'Close popup' })).toBeTruthy();
  expect(within(popup.getElement()!).queryByLabelText('Close popup')).toBeNull();
  rerender(view(secondTarget));
  expect(firstTarget.childElementCount).toBe(0);
  expect(within(secondTarget).getByRole('button', { name: 'Close popup' })).toBeTruthy();
  rerender(view(secondTarget, false));
  expect(secondTarget.childElementCount).toBe(0);
  rerender(view());
  expect(within(popup.getElement()!).getByLabelText('Close popup')).toBeTruthy();
  rerender(view(secondTarget));
  fireEvent.click(within(secondTarget).getByRole('button', { name: 'Close popup' }));
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(popup.getPosition()).toBeUndefined();
  expect(secondTarget.childElementCount).toBe(0);
  unmount();
  expect(secondTarget.childElementCount).toBe(0);
  map.dispose();
});
