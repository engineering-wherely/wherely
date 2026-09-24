import type { Branded } from '@/types/common';
import type { GeoFeature } from 'lake-pukaki';
import type { FeatureLoader } from 'ol/featureloader';

export type { Coordinate } from 'ol/coordinate';

export type Longitude = Branded<number, 'Longitude'>;
export type Latitude = Branded<number, 'Latitude'>;
export type GeographicCoordinate = [Longitude, Latitude];

export type GeoFeatureLoader = (
  ...args: Parameters<FeatureLoader>
) => Promise<GeoFeature[]>;
