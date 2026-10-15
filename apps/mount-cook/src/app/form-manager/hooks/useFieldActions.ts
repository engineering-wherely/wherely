import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import type { ADSField } from '@/app/form-manager/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';

type ADSFieldDraft = Pick<
  ADSField,
  'name' | 'description' | 'type' | 'required' | 'simple_form_id'
>;

export default function useFieldActions() {
  const admin = useAdminAccess();
  const cache = useQueryClient();
  const refresh = () => cache.invalidateQueries({ queryKey: ['form-manager'] });
  const create = useMutation({
    mutationFn: async (draft: ADSFieldDraft) => {
      if (!admin) {
        throw new Error('Sign in as an administrator to add fields.');
      }
      if (
        !draft.name.trim() ||
        draft.name.length > 256 ||
        (draft.description?.length ?? 0) > 512
      ) {
        throw new Error(
          'Enter a name of up to 256 characters and a description of up to 512 characters.'
        );
      }
      const client = generateClient<AmplifyDataSchema>({
        authMode: 'userPool',
      });
      const result = await client.mutations.createFieldDefinition({
        ...draft,
        name: draft.name.trim(),
      });
      if (result.errors?.length) {
        throw new Error(result.errors.map((error) => error.message).join('; '));
      }
      const field = result.data?.[0];
      if (!field) {
        throw new Error('The field was not created. Refresh and try again.');
      }
      return field;
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: number) => {
      if (!admin) {
        throw new Error('Sign in as an administrator to remove fields.');
      }
      const client = generateClient<AmplifyDataSchema>({
        authMode: 'userPool',
      });
      const result = await client.models.fields.delete({ id });
      if (result.errors?.length) {
        throw new Error(
          `Could not remove the field. Fields with recorded inputs cannot be removed. ${result.errors.map((error) => error.message).join('; ')}`
        );
      }
      if (!result.data) {
        throw new Error('The field was not removed. Refresh and try again.');
      }
      return result.data;
    },
    onSuccess: refresh,
  });
  return { create, remove };
}
