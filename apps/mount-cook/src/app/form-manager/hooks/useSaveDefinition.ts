import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';
import type { ADSField, ADSForm } from '../types';

type ADSFormUpdate = Pick<ADSForm, 'id' | 'name' | 'description'>;
type ADSFieldUpdate = Pick<
  ADSField,
  'id' | 'name' | 'description' | 'type' | 'required'
>;

export function useSaveDefinition() {
  const cache = useQueryClient();
  return useMutation({
    mutationFn: async (
      change:
        | { kind: 'form'; data: ADSFormUpdate }
        | { kind: 'field'; data: ADSFieldUpdate }
    ) => {
      if (!change.data.name.trim()) {
        throw new Error('A name is required.');
      }
      if (
        change.data.name.length > 256 ||
        (change.data.description?.length ?? 0) > 512
      ) {
        throw new Error(
          'Name must be at most 256 characters and description at most 512 characters.'
        );
      }
      const client = generateClient<AmplifyDataSchema>({
        authMode: 'userPool',
      });
      const result =
        change.kind === 'form'
          ? await client.models.forms.update(change.data)
          : await client.models.fields.update(change.data);
      if (result.errors?.length) {
        throw new Error(result.errors.map((error) => error.message).join('; '));
      }
      if (!result.data) {
        throw new Error('The record was not saved. Refresh and try again.');
      }
      return result.data;
    },
    onSuccess: async () => {
      await cache.invalidateQueries({ queryKey: ['form-manager'] });
    },
  });
}
