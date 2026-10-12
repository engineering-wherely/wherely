import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';
import type { Nullable } from 'np-westland/types';
import type { ADSForm } from '../types';
import { listAll } from '../utils';

export default function useFields(form: Nullable<ADSForm>) {
  return useQuery({
    queryKey: ['form-manager', 'fields', form?.id],
    enabled: form?.type === 'simple_form',
    queryFn: async () => {
      if (!form) {
        throw new Error('Select a form first');
      }
      const client = generateClient<AmplifyDataSchema>({ authMode: 'apiKey' });
      const fields = await listAll((nextToken) =>
        client.models.fields.list({
          nextToken,
          filter: { simple_form_id: { eq: form.id } },
        })
      );
      return fields.sort((a, b) => a.id - b.id);
    },
  });
}
