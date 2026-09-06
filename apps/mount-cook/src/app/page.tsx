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
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-background/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-border backdrop-blur">
          {center.join(',')}
        </div>
      </div>
    </MappingContextProvider>
  );
}
