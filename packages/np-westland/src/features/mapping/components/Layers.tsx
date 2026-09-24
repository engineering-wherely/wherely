import { LayersContext } from '@/features/mapping/contexts/LayersContext';
import { useOlMap } from '@/features/mapping/hooks/useOlMap';
import type { Nullable } from '@/types/common';
import LayerGroup from 'ol/layer/Group';
import { type ReactNode, useEffect, useState } from 'react';

export type LayersProps = {
  children?: ReactNode;
};

export function Layers({ children }: LayersProps) {
  const map = useOlMap();
  const [group, setGroup] = useState<Nullable<LayerGroup>>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const group = new LayerGroup();
    map.addLayer(group);
    setGroup(group);

    return () => {
      map.removeLayer(group);
      group.dispose();
      setGroup(null);
    };
  }, [map]);

  if (!group) {
    return null;
  }

  return <LayersContext value={group}>{children}</LayersContext>;
}

export default Layers;
