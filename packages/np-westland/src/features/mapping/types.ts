import type { Branded } from '@/types/common';

export type { Coordinate } from 'ol/coordinate';

export type Longitude = Branded<number, 'Longitude'>;
export type Latitude = Branded<number, 'Latitude'>;
export type GeographicCoordinate = [Longitude, Latitude];
