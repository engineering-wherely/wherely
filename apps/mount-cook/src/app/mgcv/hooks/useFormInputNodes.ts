'use client';

import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';

type FormInput = AmplifyDataSchema['form_inputs']['type'];

export type FormInputNode = Pick<
  FormInput,
  'id' | 'form_id' | 'form_type' | 'form_index' | 'parent_id' | 'parent_form_id'
> & {
  fieldInputs: Pick<
    AmplifyDataSchema['field_inputs']['type'],
    'id' | 'field_id' | 'form_input_id' | 'form_id' | 'form_type' | 'value'
  >[];
  children: FormInputNode[];
};

type Page<T> = {
  data: T[];
  nextToken?: string | null;
  errors?: readonly { message: string }[];
};

async function listAll<T>(
  fetchPage: (options: { nextToken?: string | null }) => Promise<Page<T>>
): Promise<T[]> {
  const records: T[] = [];
  let nextToken: string | null | undefined;

  do {
    const page = await fetchPage({ nextToken });
    if (page.errors?.length) {
      throw new Error(page.errors.map((error) => error.message).join('; '));
    }
    records.push(...page.data);
    nextToken = page.nextToken;
  } while (nextToken);

  return records;
}

function sortInputs<T extends Pick<FormInput, 'form_index' | 'id'>>(
  inputs: T[]
) {
  return inputs.sort((a, b) => a.form_index - b.form_index || a.id - b.id);
}

async function loadRecord(
  input: FormInput,
  ancestors: ReadonlySet<number> = new Set()
): Promise<FormInputNode> {
  if (ancestors.has(input.id)) {
    throw new Error(`Cycle in form inputs at ${input.id}`);
  }
  const path = new Set(ancestors).add(input.id);
  const [fieldInputs, children] = await Promise.all([
    listAll((options) => input.fieldInputs(options)),
    listAll((options) => input.children(options)),
  ]);

  return {
    id: input.id,
    form_id: input.form_id,
    form_type: input.form_type,
    form_index: input.form_index,
    parent_id: input.parent_id,
    parent_form_id: input.parent_form_id,
    fieldInputs: fieldInputs
      .sort((a, b) => a.field_id - b.field_id || a.id - b.id)
      .map(({ id, field_id, form_input_id, form_id, form_type, value }) => ({
        id,
        field_id,
        form_input_id,
        form_id,
        form_type,
        value,
      })),
    children: await Promise.all(
      sortInputs(children).map((child) => loadRecord(child, path))
    ),
  };
}

/**
 * Returns every input of the requested form (including inputs used by a parent
 * form), each with its complete descendant tree. Field values remain as stored.
 * Passing no form ID leaves the query disabled.
 */
export function useFormInputNodes(formId: number | null | undefined) {
  return useQuery({
    queryKey: ['formInputNodes', formId],
    enabled: formId != null,
    queryFn: async (): Promise<FormInputNode[]> => {
      if (formId == null) {
        throw new Error('A form ID is required');
      }
      const client = generateClient<AmplifyDataSchema>({ authMode: 'apiKey' });
      const { data: form, errors } = await client.models.forms.get({
        id: formId,
      });
      if (errors?.length) {
        throw new Error(errors.map((error) => error.message).join('; '));
      }
      if (!form) {
        throw new Error(`Form ${formId} was not found`);
      }
      const inputs = await listAll((options) => form.inputs(options));
      return Promise.all(sortInputs(inputs).map((input) => loadRecord(input)));
    },
  });
}
