import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import 'ol/ol.css';
import { OSM } from 'ol/source';
import { useEffect, useRef } from 'react';

export default function MapArtisan() {
  const targetRef = useRef<HTMLDivElement>(null);

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
        center: [0, 0],
        zoom: 2,
      }),
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <div
      ref={targetRef}
      id='map'
      className='w-full h-full'
    ></div>
  );
}
