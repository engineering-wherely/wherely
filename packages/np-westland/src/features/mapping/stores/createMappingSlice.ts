import { fromLonLat, toGeograhicCoordinate } from '@/features/mapping/utils';
import { Coordinate } from 'ol/coordinate';
import { ProjectionLike } from 'ol/proj';
import { StateCreator } from 'zustand';

export interface MappingSlice {
  center: Coordinate;
  zoom: number;
  projection: ProjectionLike;
  location: string;
  result: unknown[];
  setLocation: (location: string) => void;
  setResult: (result: unknown[]) => void;
}

const createMappingSlice: StateCreator<MappingSlice, [], [], MappingSlice> = (set) => ({
  center: fromLonLat(toGeograhicCoordinate([172.62, -43.53]), 'EPSG:3857'), // Hagley Park in Christchurch
  zoom: 14,
  projection: 'EPSG:3857',
  location: '',
  result: [],
  setLocation: (location) => set({ location }),
  setResult: (result) => set({ result }),
});

export default createMappingSlice;
