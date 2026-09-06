'use client';

import { MountCookMappingService } from '@/services/mapping/MountCookMappingService';
import store from '@/store';
import { MapArtisan, MappingContextProvider } from 'np-westland';
import type { Coordinate } from 'np-westland/types';
import { useStore } from 'zustand';

export default function Home() {
  const mappingService = new MountCookMappingService();
  const zoom = useStore(store, (s) => s.zoom);
  const center = useStore(store, (s) => s.center);
  const projection = useStore(store, (s) => s.projection);
  const setCenter = useStore(store, (s) => s.setCenter);

  function onCenterChanged(c: Coordinate) {
    setCenter(c);
  }

  return (
    <MappingContextProvider service={mappingService} store={store}>
      <div className="relative h-full w-full">
        <MapArtisan
          zoom={zoom}
          center={center}
          projection={projection}
          listeners={{ onCenterChanged }}
        />
      </div>
    </MappingContextProvider>
  );
}
