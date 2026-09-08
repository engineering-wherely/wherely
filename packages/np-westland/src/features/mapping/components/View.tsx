import { useOlMap } from '@/features/mapping/hooks/useOlMap';
import type { Nullable, Optional } from '@/types/common';
import type { Coordinate } from 'ol/coordinate';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import { equivalent, get as getProjection } from 'ol/proj';
import OlView, { type ViewOptions } from 'ol/View';
import { useEffect, useRef } from 'react';

export type ViewProps = ViewOptions & {
  listeners?: {
    onCenterChanged?: (center: Optional<Coordinate>) => void;
  };
};

export function View({
  center,
  listeners,
  projection,
  resolution,
  rotation,
  zoom,
  ...props
}: ViewProps) {
  const map = useOlMap();
  const viewRef = useRef<Nullable<OlView>>(null);
  const propsRef = useRef<ViewOptions>({});
  propsRef.current = {
    ...props,
    center,
    projection,
    resolution,
    rotation,
    zoom,
  };

  useEffect(() => {
    if (!map) {
      return;
    }

    const view = new OlView(propsRef.current);
    viewRef.current = view;
    map.setView(view);

    return () => {
      viewRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const _projection = getProjection(projection);
    let view = map.getView();
    if (_projection && !equivalent(_projection, view.getProjection())) {
      view = new OlView(propsRef.current);
      viewRef.current = view;
      map.setView(view);
    }

    const keys: EventsKey[] = [];
    if (listeners?.onCenterChanged) {
      keys.push(
        view.on('change:center', (event) => {
          listeners.onCenterChanged?.(event.target.getCenter());
        }) as EventsKey
      );
    }

    return () => {
      for (const key of keys) {
        unByKey(key);
      }
    };
  }, [listeners, map, projection]);

  useEffect(() => {
    viewRef.current?.setCenter(center);
  }, [center]);

  useEffect(() => {
    viewRef.current?.setResolution(resolution);
  }, [resolution]);

  useEffect(() => {
    if (rotation !== undefined) {
      viewRef.current?.setRotation(rotation);
    }
  }, [rotation]);

  useEffect(() => {
    if (zoom !== undefined) {
      viewRef.current?.setZoom(zoom);
    }
  }, [zoom]);

  return null;
}

export default View;
