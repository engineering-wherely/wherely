'use client';

import { MapArtisan } from 'np-westland';

export default function Home() {
  return <MapArtisan zoom={14} center={[172.62, -43.53]} />;
}
