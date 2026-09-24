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
  const contentRef = useRef<Nullable<HTMLDivElement>>(null);
  const popupRef = useRef<Nullable<OlExtPopup>>(null);
  const [content, setContent] = useState<Nullable<HTMLDivElement>>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  useEffect(() => {
    if (!map) {
      return;
    }

    const content = document.createElement('div');
    const popup = new OlExtPopup({
      closeBox: false,
      popupClass: cn('np-westland-popup-overlay', popupClassName),
      positioning: 'center-right',
      stopEvent: true,
      ...popupOptions,
    });
    map.addOverlay(popup);
    contentRef.current = content;
    popupRef.current = popup;
    setContent(content);

    return () => {
      popup.hide();
      map.removeOverlay(popup);
      contentRef.current = null;
      popupRef.current = null;
      setContent(null);
    };
  }, [map, popupClassName, popupOptions]);

  useEffect(() => {
    if (!map || !popupRef.current || !content) {
      return;
    }

    const popup = popupRef.current;
    const updatePosition = () => {
      if (!isOpen) {
        popup.hide();
        return;
      }

      const nextCoordinate = getCoordinate(map, coordinate);
      if (!nextCoordinate) {
        popup.hide();
        return;
      }

      const position = popup.getPosition();
      if (
        !content.parentElement ||
        !position ||
        position.length !== nextCoordinate.length ||
        position.some((value, index) => value !== nextCoordinate[index])
      ) {
        popup.show(nextCoordinate, content);
      }
    };

    updatePosition();

    if (!updateOnPostRender) {
      return;
    }

    const keys: EventsKey[] = [
      map.on('change:size', updatePosition),
      map.on('postrender', updatePosition),
    ];

    return () => {
      for (const key of keys) {
        unByKey(key);
      }
    };
  }, [content, coordinate, isOpen, map, updateOnPostRender]);

  function handleClose() {
    setUncontrolledOpen(false);
    onOpenChange?.(false);
  }

  if (!content) {
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
    content
  );
}

function getCoordinate(map: Map, coordinate: Optional<PopupCoordinate>) {
  if (typeof coordinate === 'function') {
    return coordinate(map);
  }

  return coordinate ?? map.getView().getCenter();
}

export default Popup;
