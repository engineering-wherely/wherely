import { VectorSourceContext } from '@/features/mapping/contexts/VectorSourceContext';
import type { Nullable } from '@/types/common';
import OlFeature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type { StyleLike } from 'ol/style/Style';
import { useContext, useEffect, useState } from 'react';

export type FeatureProps = {
  id?: string | number;
  /** Geometry coordinates must use the map view's projection. */
  geometry?: Geometry;
  properties?: Record<string, unknown>;
  style?: StyleLike;
};

export function Feature({ id, geometry, properties, style }: FeatureProps) {
  const source = useContext(VectorSourceContext);
  const [feature, setFeature] = useState<Nullable<OlFeature>>(null);

  useEffect(() => {
    if (!source) {
      return;
    }

    const feature = new OlFeature();
    source.addFeature(feature);
    setFeature(feature);

    return () => {
      source.removeFeature(feature);
      setFeature(null);
    };
  }, [source]);

  useEffect(() => {
    if (!feature) {
      return;
    }

    for (const key of feature.getKeys()) {
      if (
        key !== feature.getGeometryName() &&
        !Object.prototype.hasOwnProperty.call(properties ?? {}, key)
      ) {
        feature.unset(key);
      }
    }
    feature.setProperties(properties ?? {});
    feature.setGeometry(geometry);
    feature.setId(id);
    feature.setStyle(style);
  }, [feature, id, geometry, properties, style]);

  return null;
}

export default Feature;
