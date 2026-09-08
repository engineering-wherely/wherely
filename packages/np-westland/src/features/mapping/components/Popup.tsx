import '@/features/mapping/components/Popup.css';
import { useOlMap } from '@/features/mapping/hooks/useOlMap';
import { cn } from '@/shadcn-ui/lib/utils';
import type { Nullable, Optional } from '@/types/common';
import { XIcon } from 'lucide-react';
import OlExtPopup, { type PopupOptions } from 'ol-ext/overlay/Popup';
import 'ol-ext/overlay/Popup.css';
import type { Coordinate } from 'ol/coordinate';
import type { EventsKey } from 'ol/events';
import type Map from 'ol/Map';
import { unByKey } from 'ol/Observable';
import { type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type PopupCoordinate = Coordinate | ((map: Map) => Optional<Coordinate>);

export type PopupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  closeLabel?: string;
  coordinate?: PopupCoordinate;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  popupClassName?: string;
  popupOptions?: Omit<PopupOptions, 'closeBox' | 'html' | 'popupClass'>;
  showCloseButton?: boolean;
  updateOnPostRender?: boolean;
};

export function Popup({
  children,
  className,
  closeLabel = 'Close popup',
  coordinate,
  defaultOpen = true,
  onOpenChange,
  open,
  popupClassName,
  popupOptions,
  showCloseButton = true,
  updateOnPostRender = false,
  ...props
}: PopupProps) {
  const map = useOlMap();
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const popupRef = useRef<Nullable<OlExtPopup>>(null);
  const [container, setContainer] = useState<Nullable<HTMLDivElement>>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  useEffect(() => {
    if (!map) {
      return;
    }

    const container = document.createElement('div');
    const popup = new OlExtPopup({
      closeBox: false,
      popupClass: cn('np-westland-popup-overlay', popupClassName),
      positioning: 'center-right',
      stopEvent: true,
      ...popupOptions,
    });
    map.addOverlay(popup);
    containerRef.current = container;
    popupRef.current = popup;
    setContainer(container);

    return () => {
      popup.hide();
      map.removeOverlay(popup);
      containerRef.current = null;
      popupRef.current = null;
      setContainer(null);
    };
  }, [map, popupClassName, popupOptions]);

  useEffect(() => {
    if (!map || !popupRef.current || !container) {
      return;
    }

    if (!isOpen) {
      popupRef.current.hide();
      return;
    }

    const nextCoordinate = getCoordinate(map, coordinate);
    if (!nextCoordinate) {
      popupRef.current.hide();
      return;
    }

    popupRef.current.show(nextCoordinate, container);
  }, [container, coordinate, isOpen, map]);

  useEffect(() => {
    if (!map || !updateOnPostRender) {
      return;
    }

    const keys: EventsKey[] = [
      map.on('change:size', () => updatePopupPosition(map, coordinate, popupRef.current)),
      map.on('postrender', () => updatePopupPosition(map, coordinate, popupRef.current)),
    ];

    return () => {
      for (const key of keys) {
        unByKey(key);
      }
    };
  }, [coordinate, map, updateOnPostRender]);

  function handleClose() {
    setUncontrolledOpen(false);
    onOpenChange?.(false);
  }

  if (!container) {
    return null;
  }

  return createPortal(
    <div
      className={cn('np-westland-popup', className)}
      {...props}
    >
      <div className='np-westland-popup__body'>{children}</div>
      {showCloseButton ? (
        <button
          type='button'
          aria-label={closeLabel}
          className='np-westland-popup__close'
          onClick={handleClose}
        >
          <XIcon aria-hidden='true' />
        </button>
      ) : null}
    </div>,
    container
  );
}

function getCoordinate(map: Map, coordinate: Optional<PopupCoordinate>) {
  if (typeof coordinate === 'function') {
    return coordinate(map);
  }

  return coordinate ?? map.getView().getCenter();
}

function updatePopupPosition(
  map: Map,
  coordinate: Optional<PopupCoordinate>,
  popup: Nullable<OlExtPopup>
) {
  if (!popup?.getVisible()) {
    return;
  }

  const nextCoordinate = getCoordinate(map, coordinate);
  if (nextCoordinate) {
    popup.show(nextCoordinate);
  }
}

export default Popup;
