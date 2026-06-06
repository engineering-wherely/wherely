'use client';

import { MountCookMappingService } from '@/services/mapping/MountCookMappingService';
import { MapArtisan, MappingContext } from 'np-westland';

export default function Home() {
  const mappingService = new MountCookMappingService();

  return (
    <MappingContext value={mappingService}>
      <MapArtisan zoom={14} center={[172.62, -43.53]} />
    </MappingContext>
  );
}
