import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';
import { listAll } from '../utils';

export default function useCatalog() {
  return useQuery({
    queryKey: ['form-manager', 'catalog'],
    queryFn: async () => {
      const client = generateClient<AmplifyDataSchema>({ authMode: 'apiKey' });
      const [forms, slots] = await Promise.all([
        listAll((nextToken) => client.models.forms.list({ nextToken })),
        listAll((nextToken) =>
          client.models.form_compositions.list({ nextToken })
        ),
      ]);
      return {
        forms,
        slots: slots.sort(
          (a, b) => a.name.localeCompare(b.name) || a.id - b.id
        ),
      };
    },
  });
}
