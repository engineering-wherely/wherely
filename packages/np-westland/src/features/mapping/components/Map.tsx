import { OlMapContext } from '@/features/mapping/contexts/OlMapContext';
import { useOlMap } from '@/features/mapping/hooks/useOlMap';
import type { Nullable } from '@/types/common';
import { Tile as TileLayer } from 'ol/layer';
import OlMap from 'ol/Map';
import 'ol/ol.css';
import { OSM } from 'ol/source';
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

export type MapProps = {
  children?: ReactNode;
};

export type OlMapInstance = ReturnType<typeof useOlMap>;

export function Map({ children }: MapProps) {
  const targetRef = useRef<Nullable<HTMLDivElement>>(null);
  const [map, setMap] = useState<Nullable<OlMap>>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return;
    }

    const olMap = new OlMap({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target,
    });
    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
      setMap(null);
    };
  }, []);

  return (
    <OlMapContext value={map}>
      <div
        ref={targetRef}
        className='h-full w-full'
      />
      {children}
    </OlMapContext>
  );
}

export default Map;
