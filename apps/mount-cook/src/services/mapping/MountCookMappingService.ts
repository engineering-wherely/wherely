import type { MappingService } from 'np-westland';

type GeocodingApiResponse = {
  results?: unknown[];
  error?: string;
};

const defaultApiUrl =
  process.env.NEXT_PUBLIC_MOUNT_COOK_API_URL ??
  process.env.MOUNT_COOK_API_URL ??
  (typeof window === 'undefined' ? undefined : window.location.origin);

export class MountCookMappingService implements MappingService {
  constructor(private readonly apiUrl = defaultApiUrl) {}

  async geocode(location: string): Promise<unknown[]> {
    const trimmedLocation = location.trim();

    if (!trimmedLocation) {
      return [];
    }

    if (!this.apiUrl) {
      throw new Error('Mount Cook API URL is not configured.');
    }

    const url = new URL('/api/geocoding', this.apiUrl);
    url.searchParams.set('address', trimmedLocation);

    const response = await fetch(url);
    const data = (await response.json()) as GeocodingApiResponse;

    if (!response.ok) {
      throw new Error(data.error ?? 'Failed to geocode location.');
    }

    return data.results ?? [];
  }
}
