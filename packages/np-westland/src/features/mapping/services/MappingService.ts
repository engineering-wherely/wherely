import type { GeocodeResult } from '@googlemaps/google-maps-services-js';

interface MappingService {
  geocode(location: string): Promise<GeocodeResult[]>;
}

export default MappingService;
