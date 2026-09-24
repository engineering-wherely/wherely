'use client';

import { useGeoFeaturesLoader } from '@/app/mgcv/hooks/useGeoFeaturesLoader';
import {
  VectorLayer as NPWVectorLayer,
  type VectorLayerProps as NPWVectorLayerProps,
} from 'np-westland';

export type VectorLayerProps = Omit<NPWVectorLayerProps, 'loader'> & {
  geoLayerId: number;
};

export default function VectorLayer({
  geoLayerId,
  ...props
}: VectorLayerProps) {
  const loader = useGeoFeaturesLoader(geoLayerId);

  return <NPWVectorLayer {...props} loader={loader} />;
}
