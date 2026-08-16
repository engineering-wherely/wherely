import type { GeographicCoordinate, Latitude, Longitude } from '@/features/mapping/types';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat as _fromLonLat, toLonLat as _toLonLat, ProjectionLike } from 'ol/proj';

export function toLongitude(value: number): Longitude {
  if (value < -180 || value > 180) {
    throw new Error('Invalid longitude');
  }

  return value as Longitude;
}

export function toLatitude(value: number): Latitude {
  if (value < -90 || value > 90) {
    throw new Error('Invalid latitude');
  }

  return value as Latitude;
}

export function toGeograhicCoordinate(values: number[]): GeographicCoordinate {
  if (values.length < 2) {
    throw new Error('The values must have 2 values at least');
  }

  return [toLongitude(values[0]), toLatitude(values[1])];
}

export function fromLonLat(gc: GeographicCoordinate, p: ProjectionLike): Coordinate {
  return _fromLonLat(gc, p);
}

export function toLonLat(c: Coordinate, p: ProjectionLike): GeographicCoordinate {
  return toGeograhicCoordinate(_toLonLat(c, p));
}
