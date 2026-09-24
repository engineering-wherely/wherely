'use client';

import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema, GeoLayer } from 'lake-pukaki';
import type { Nullable } from 'np-westland/types';

export function useGeoLayers() {
  return useQuery({
    queryKey: ['geoLayers'],
    queryFn: async function loadGeoLayers() {
      const client = generateClient<AmplifyDataSchema>({ authMode: 'apiKey' });
      const layers: GeoLayer[] = [];
      let nextToken: Nullable<string> = null;

      do {
        const page: Awaited<
          ReturnType<typeof client.models.geo_layers.list<never[]>>
        > = await client.models.geo_layers.list({
          nextToken,
        });

        if (page.errors?.length) {
          throw new Error(page.errors.map((error) => error.message).join('; '));
        }

        layers.push(
          ...page.data.map((layer) => ({
            id: layer.id,
            name: layer.name,
          }))
        );
        nextToken = page.nextToken ?? null;
      } while (nextToken);
      return layers;
    },
  });
}
