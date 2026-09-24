import { Feature } from '@/features/mapping/components/Feature';
import { Layers } from '@/features/mapping/components/Layers';
import { VectorLayer } from '@/features/mapping/components/VectorLayer';
import { OlMapContext } from '@/features/mapping/contexts/OlMapContext';
import { render } from '@testing-library/react';
import OlFeature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LayerGroup from 'ol/layer/Group';
import OlVectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import { StrictMode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
});

it('owns OpenLayers objects and updates them without replacing them', () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  const map = new OlMap({ controls: [], layers: [] });
  const first = new Point([10, 20]);
  const second = new Point([30, 40]);
  const style = new Style();
  const content = (updated: boolean, showFeature = true) => (
    <StrictMode>
      <OlMapContext value={map}>
        <Layers>
          <VectorLayer
            visible={!updated}
            opacity={updated ? 0.5 : 1}
            zIndex={updated ? 5 : 0}
            style={style}
          >
            {showFeature && (
              <Feature
                id={updated ? 'second' : 'first'}
                geometry={updated ? second : first}
                properties={updated ? undefined : { name: 'First' }}
                style={updated ? style : undefined}
              />
            )}
          </VectorLayer>
          <VectorLayer>
            <Feature
              id='other'
              geometry={first}
            />
          </VectorLayer>
        </Layers>
      </OlMapContext>
    </StrictMode>
  );
  const { rerender, unmount } = render(content(false));
  expect(map.getLayers().getLength()).toBe(1);
  const group = map.getLayers().item(0) as LayerGroup;
  expect(group).toBeInstanceOf(LayerGroup);
  expect(group.getLayers().getLength()).toBe(2);
  const layer = group.getLayers().item(0) as OlVectorLayer<VectorSource>;
  expect(layer).toBeInstanceOf(OlVectorLayer);
  const source = layer.getSource()!;
  const feature = source.getFeatureById('first') as OlFeature;
  expect(feature).toBeInstanceOf(OlFeature);
  expect(feature.getGeometry()).toBe(first);
  expect(feature.get('name')).toBe('First');
  expect(source.getFeatures()).toHaveLength(1);

  rerender(content(true));
  expect(group.getLayers().item(0)).toBe(layer);
  expect(source.getFeatureById('second')).toBe(feature);
  expect(source.getFeatureById('first')).toBeNull();
  expect(feature.getGeometry()).toBe(second);
  expect(feature.get('name')).toBeUndefined();
  expect(feature.getStyle()).toBe(style);
  expect(layer.getVisible()).toBe(false);
  expect(layer.getOpacity()).toBe(0.5);
  expect(layer.getZIndex()).toBe(5);

  rerender(content(true, false));
  expect(source.getFeatures()).toHaveLength(0);
  const otherLayer = group.getLayers().item(1) as OlVectorLayer<VectorSource>;
  expect(otherLayer.getSource()?.getFeatures()).toHaveLength(1);
  unmount();
  expect(map.getLayers().getLength()).toBe(0);
  expect(group.getLayers().getLength()).toBe(0);
  map.dispose();
});
