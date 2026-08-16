'use client';

import { MountCookMappingService } from '@/services/mapping/MountCookMappingService';
import store from '@/store';
import { MapArtisan, MappingContextProvider } from 'np-westland';
import { useStore } from 'zustand';

export default function Home() {
  const mappingService = new MountCookMappingService();
  const zoom = useStore(store, (s) => s.zoom);
  const center = useStore(store, (s) => s.center);
  const projection = useStore(store, (s) => s.projection);

  return (
    <MappingContextProvider service={mappingService} store={store}>
      <MapArtisan zoom={zoom} center={center} projection={projection} />
    </MappingContextProvider>
  );
}
