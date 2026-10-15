import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import type { ADSFieldInput, ADSFormInput } from '@/app/form-manager/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';

type ADSInputChange =
  | {
      kind: 'create-form';
      data: Pick<
        ADSFormInput,
        'form_id' | 'parent_id' | 'composition_id' | 'index'
      >;
    }
  | { kind: 'remove-form'; data: Pick<ADSFormInput, 'id'> }
  | {
      kind: 'create-field';
      data: Pick<ADSFieldInput, 'form_input_id' | 'field_id' | 'value'>;
    }
  | { kind: 'remove-field'; data: Pick<ADSFieldInput, 'id'> };

export default function useInputActions() {
  const admin = useAdminAccess();
  const cache = useQueryClient();
  return useMutation({
    mutationFn: async (change: ADSInputChange) => {
      if (!admin) {
        throw new Error('Sign in as an administrator to change inputs.');
      }
      const client = generateClient<AmplifyDataSchema>({
        authMode: 'userPool',
      });
      switch (change.kind) {
        case 'create-form': {
          const result = await client.mutations.createFormInput(change.data);
          if (result.errors?.length) {
            throw new Error(
              result.errors.map((error) => error.message).join('; ')
            );
          }
          const input = result.data?.[0];
          if (!input) {
            throw new Error(
              'The form input was not created. Check the selected form, slot, and parent input.'
            );
          }
          return { kind: 'create-form' as const, input };
        }
        case 'create-field': {
          const result = await client.mutations.createFieldInput(change.data);
          if (result.errors?.length) {
            throw new Error(
              result.errors.map((error) => error.message).join('; ')
            );
          }
          if (!result.data?.[0]) {
            throw new Error(
              'The field input was not created. Refresh and try again.'
            );
          }
          return { kind: 'create-field' as const };
        }
        case 'remove-form':
        case 'remove-field': {
          const result =
            change.kind === 'remove-form'
              ? await client.models.form_inputs.delete(change.data)
              : await client.models.field_inputs.delete(change.data);
          if (result.errors?.length) {
            throw new Error(
              result.errors.map((error) => error.message).join('; ')
            );
          }
          if (!result.data) {
            throw new Error(
              'The input was not removed. Refresh and try again.'
            );
          }
          return { kind: change.kind };
        }
      }
    },
    onSuccess: async () => {
      await cache.invalidateQueries({ queryKey: ['form-manager'] });
    },
  });
}
