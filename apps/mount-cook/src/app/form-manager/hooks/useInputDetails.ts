import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';
import type { Nullable } from 'np-westland/types';
import type { ADSFieldInput, ADSFormInput } from '../types';
import { listAll } from '../utils';

export default function useInputDetails(input: Nullable<ADSFormInput>) {
  return useQuery({
    queryKey: ['form-manager', 'details', input?.id, input?.form_type],
    enabled: input !== null,
    queryFn: async () => {
      if (!input) {
        throw new Error('Select an input first');
      }
      const client = generateClient<AmplifyDataSchema>({ authMode: 'apiKey' });
      if (input.form_type === 'simple_form') {
        const values = await listAll((nextToken) =>
          client.models.field_inputs.list({
            nextToken,
            filter: { form_input_id: { eq: input.id } },
          })
        );
        return { values, children: [] as ADSFormInput[] };
      }
      const children = await listAll((nextToken) =>
        client.models.form_inputs.list({
          nextToken,
          filter: { parent_id: { eq: input.id } },
        })
      );
      return {
        values: [] as ADSFieldInput[],
        children: children.sort((a, b) => a.index - b.index || a.id - b.id),
      };
    },
  });
}
