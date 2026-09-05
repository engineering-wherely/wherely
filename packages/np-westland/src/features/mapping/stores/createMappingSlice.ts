import { fromLonLat, toGeograhicCoordinate } from '@/features/mapping/utils';
import type { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { Coordinate } from 'ol/coordinate';
import { ProjectionLike } from 'ol/proj';
import { StateCreator } from 'zustand';

export interface MappingSlice {
  center: Coordinate;
  zoom: number;
  projection: ProjectionLike;
  location: string;
  result: GeocodeResult[];
  setCenter: (c: Coordinate) => void;
  setLocation: (location: string) => void;
  setResult: (result: GeocodeResult[]) => void;
}

const createMappingSlice: StateCreator<MappingSlice, [], [], MappingSlice> = (set) => ({
  center: fromLonLat(toGeograhicCoordinate([172.62, -43.53]), 'EPSG:3857'), // Hagley Park in Christchurch
  zoom: 14,
  projection: 'EPSG:3857',
  location: '',
  result: [],
  setCenter: (c) => set({ center: c }),
  setLocation: (location) => set({ location }),
  setResult: (result) => set({ result }),
});

export default createMappingSlice;
