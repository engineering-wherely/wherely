import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';
import type { Nullable } from 'np-westland/types';
import { listAll } from '../utils';

export default function useInputs(
  formId: Nullable<number>,
  slotId: Nullable<number>
) {
  return useQuery({
    queryKey: ['form-manager', 'inputs', formId, slotId],
    enabled: formId !== null,
    queryFn: async () => {
      if (formId === null) {
        throw new Error('Select a form first');
      }
      const client = generateClient<AmplifyDataSchema>({ authMode: 'apiKey' });
      const inputs = await listAll((nextToken) =>
        client.models.form_inputs.list({
          nextToken,
          filter: {
            form_id: { eq: formId },
            ...(slotId === null ? {} : { composition_id: { eq: slotId } }),
          },
        })
      );
      return inputs.sort((a, b) => a.index - b.index || a.id - b.id);
    },
  });
}
