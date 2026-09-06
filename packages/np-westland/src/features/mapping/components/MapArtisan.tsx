import { GeocodingInput } from '@/features/mapping/components/GeocodingInput';
import { useGeocoding } from '@/features/mapping/hooks/useGeocoding';
import { usePrevious } from '@/hooks';
import { Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { EventsKey } from 'ol/events';
import { Tile as TileLayer } from 'ol/layer';
import { unByKey } from 'ol/Observable';
import 'ol/ol.css';
import { equivalent, get as getProjection, ProjectionLike } from 'ol/proj';
import { OSM } from 'ol/source';
import { useEffect, useRef } from 'react';

type MapArtisanProps = {
  zoom: number;
  center: Coordinate;
  projection: ProjectionLike;
  listeners: { onCenterChanged: (center: Coordinate) => void };
};

export default function MapArtisan({ zoom, center, projection, listeners }: MapArtisanProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const viewStateRef = useRef({ center, zoom });
  const { location, result, setLocation } = useGeocoding();
  const previousProjection = usePrevious(projection);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return;
    }

    const map = new Map({
      target,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View(),
    });
    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    viewStateRef.current = { center, zoom };
  }, [center, zoom]);

  useEffect(() => {
    const view = mapRef.current?.getView();
    if (!view) {
      return;
    }

    view.setCenter(center);
  }, [center]);

  useEffect(() => {
    const view = mapRef.current?.getView();
    if (!view) {
      return;
    }

    view.setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const { center, zoom } = viewStateRef.current;
    const _projection = getProjection(projection);
    const _previousProjection = getProjection(previousProjection);
    if (_projection && (!_previousProjection || !equivalent(_projection, _previousProjection))) {
      map.setView(
        new View({
          center,
          zoom,
          projection,
        })
      );
    }

    const view = map.getView();
    const { onCenterChanged } = listeners;
    const keys: EventsKey[] = [];
    keys.push(
      view.on('change:center', (event) => {
        onCenterChanged(event.target.getCenter());
      }) as EventsKey
    );
    return () => {
      for (const k of keys) {
        unByKey(k);
      }
    };
  }, [projection, previousProjection, listeners]);

  return (
    <div className='relative w-full h-full'>
      <div
        ref={targetRef}
        id='map'
        className='w-full h-full'
      ></div>
      <div className='absolute left-1/2 top-4 z-10 w-full max-w-sm -translate-x-1/2 px-4'>
        <GeocodingInput
          location={location}
          result={result}
          onLocationChange={(location) => {
            setLocation(location);
          }}
        />
      </div>
    </div>
  );
}
