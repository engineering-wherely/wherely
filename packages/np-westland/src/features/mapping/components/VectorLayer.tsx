import { LayersContext } from '@/features/mapping/contexts/LayersContext';
import { VectorSourceContext } from '@/features/mapping/contexts/VectorSourceContext';
import type { GeoFeatureLoader } from '@/features/mapping/types';
import type { Nullable } from '@/types/common';
import WKB from 'ol/format/WKB';
import OlVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';
import { type ReactNode, useContext, useEffect, useState } from 'react';

export type VectorLayerProps = {
  children?: ReactNode;
  loader?: GeoFeatureLoader;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
  style?: Nullable<StyleLike>;
};

export function VectorLayer({
  children,
  loader,
  visible = true,
  opacity = 1,
  zIndex = 0,
  style,
}: VectorLayerProps) {
  const group = useContext(LayersContext);
  const [layer, setLayer] = useState<Nullable<OlVectorLayer<VectorSource>>>(null);

  useEffect(() => {
    if (!group) {
      return;
    }

    let active = true;
    const source = new VectorSource({
      loader: loader
        ? async (extent, resolution, projection, success, failure) => {
            try {
              const records = await loader(extent, resolution, projection);
              if (!active) {
                return;
              }

              const format = new WKB();
              const features = records.map((record) => {
                const feature = format.readFeature(record.geometry, {
                  dataProjection: 'EPSG:4326',
                  featureProjection: projection,
                });
                feature.setId(record.id);
                feature.setProperties({
                  geoLayerId: record.geoLayerId,
                  originalInput: record.originalInput,
                  originalCrs: record.originalCrs,
                });
                return feature;
              });

              source.addFeatures(features);
              success?.(features);
            } catch {
              if (!active) {
                return;
              }

              source.removeLoadedExtent(extent);
              failure?.();
            }
          }
        : undefined,
    });
    const layer = new OlVectorLayer({ source });
    group.getLayers().push(layer);
    setLayer(layer);

    return () => {
      active = false;
      group.getLayers().remove(layer);
      layer.dispose();
      source.clear();
      source.dispose();
      setLayer(null);
    };
  }, [group, loader]);

  useEffect(() => {
    if (!layer) {
      return;
    }

    layer.setVisible(visible);
    layer.setOpacity(opacity);
    layer.setZIndex(zIndex);
    layer.setStyle(style);
  }, [layer, visible, opacity, zIndex, style]);

  if (!layer) {
    return null;
  }

  return <VectorSourceContext value={layer.getSource()}>{children}</VectorSourceContext>;
}

export default VectorLayer;
