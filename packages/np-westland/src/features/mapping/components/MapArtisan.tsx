import { GeocodingInput } from '@/features/mapping/components/GeocodingInput';
import { useGeocoding } from '@/features/mapping/hooks/useGeocoding';
import type { GeographicCoordinate } from '@/features/mapping/types';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import 'ol/ol.css';
import { fromLonLat, ProjectionLike } from 'ol/proj';
import { OSM } from 'ol/source';
import { useEffect, useMemo, useRef } from 'react';

type MapArtisanProps = {
  zoom: number;
  center: GeographicCoordinate;
  projection: ProjectionLike;
};

export default function MapArtisan({ zoom, center, projection }: MapArtisanProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const _center = useMemo(() => fromLonLat(center, projection), [center, projection]);
  const { location, result, setLocation } = useGeocoding();

  useEffect(() => {
    const target = targetRef.current!;
    const map = new Map({
      target,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: _center,
        zoom,
        projection,
      }),
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [zoom, _center, projection]);

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
