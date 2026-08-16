'use client';

import { MountCookMappingService } from '@/services/mapping/MountCookMappingService';
import store from '@/store';
import { MapArtisan, MappingContextProvider } from 'np-westland';

export default function Home() {
  const mappingService = new MountCookMappingService();

  return (
    <MappingContextProvider service={mappingService} store={store}>
      <MapArtisan zoom={14} center={[172.62, -43.53]} />
    </MappingContextProvider>
  );
}
