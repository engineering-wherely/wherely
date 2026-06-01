import { Map, View } from 'ol';
import type { Coordinate } from 'ol/coordinate';
import { Tile as TileLayer } from 'ol/layer';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { useEffect, useRef } from 'react';
import { Autocomplete } from '@/components/autocomplete/Autocomplete';

type GeographicCoordinate = Coordinate;
type MapArtisanProps = {
  zoom: number;
  center: GeographicCoordinate;
};

export default function MapArtisan({ zoom, center }: MapArtisanProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const _center = fromLonLat(center, 'EPSG:3857');

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
      }),
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [zoom, _center]);

  return (
    <div className='relative w-full h-full'>
      <div
        ref={targetRef}
        id='map'
        className='w-full h-full'
      ></div>
      <div className='absolute left-1/2 top-4 z-10 w-full max-w-sm -translate-x-1/2 px-4'>
        <Autocomplete options={[]} />
      </div>
    </div>
  );
}
