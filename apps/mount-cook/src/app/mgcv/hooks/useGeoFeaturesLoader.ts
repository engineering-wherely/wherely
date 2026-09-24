'use client';

import { useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema, GeoFeature } from 'lake-pukaki';
import type { GeoFeatureLoader, Nullable } from 'np-westland/types';
import { useCallback } from 'react';

export function useGeoFeaturesLoader(geoLayerId: number): GeoFeatureLoader {
  const queryClient = useQueryClient();

  return useCallback<GeoFeatureLoader>(
    async function () {
      return queryClient.query({
        queryKey: ['geoFeatures', geoLayerId],
        staleTime: 60_000,
        queryFn: async (): Promise<GeoFeature[]> => {
          const client = generateClient<AmplifyDataSchema>({
            authMode: 'apiKey',
          });
          const records: GeoFeature[] = [];
          let nextToken: Nullable<string> = null;

          do {
            const page: Awaited<
              ReturnType<typeof client.models.geo_features.list<never[]>>
            > = await client.models.geo_features.list({
              filter: { geo_layer_id: { eq: geoLayerId } },
              nextToken,
            });

            if (page.errors?.length) {
              throw new Error(
                page.errors.map((error) => error.message).join('; ')
              );
            }

            records.push(
              ...page.data.map((record) => ({
                id: record.id,
                geoLayerId: record.geo_layer_id,
                geometry: record.geometry,
                originalInput: record.original_input,
                originalCrs: record.original_crs,
              }))
            );
            nextToken = page.nextToken ?? null;
          } while (nextToken);

          return records;
        },
      });
    },
    [geoLayerId, queryClient]
  );
}
