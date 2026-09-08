import Map from '@/features/mapping/components/Map';
import View from '@/features/mapping/components/View';
import type { Coordinate } from 'ol/coordinate';
import type { ProjectionLike } from 'ol/proj';
import type { ReactNode } from 'react';

export type MapArtisanProps = {
  children?: ReactNode;
  zoom: number;
  center: Coordinate;
  projection: ProjectionLike;
  listeners: { onCenterChanged: (center: Coordinate) => void };
};

export default function MapArtisan({
  children,
  zoom,
  center,
  projection,
  listeners,
}: MapArtisanProps) {
  return (
    <Map>
      <View
        center={center}
        listeners={{
          onCenterChanged: (nextCenter) => {
            if (nextCenter) {
              listeners.onCenterChanged(nextCenter);
            }
          },
        }}
        projection={projection}
        zoom={zoom}
      />
      {children}
    </Map>
  );
}
