'use client';

import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema, FormInputNode } from 'lake-pukaki';
import type { Maybe } from 'np-westland/types';

type ADSFormInput = AmplifyDataSchema['form_inputs']['type'];

type ADSFormInputNode = Pick<
  ADSFormInput,
  | 'id'
  | 'form_id'
  | 'form_type'
  | 'form_index'
  | 'parent_id'
  | 'parent_form_id'
  | 'parent_form_type'
> & {
  fieldInputs: Pick<
    AmplifyDataSchema['field_inputs']['type'],
    'id' | 'field_id' | 'form_input_id' | 'form_id' | 'form_type' | 'value'
  >[];
  children: ADSFormInputNode[];
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

function sortInputs<T extends Pick<ADSFormInput, 'form_index' | 'id'>>(
  inputs: T[]
) {
  return inputs.sort((a, b) => a.form_index - b.form_index || a.id - b.id);
}

async function loadRecord(
  input: ADSFormInput,
  ancestors: ReadonlySet<number> = new Set()
): Promise<ADSFormInputNode> {
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
    parent_form_type: input.parent_form_type,
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

function toFormInputNode(input: ADSFormInputNode): FormInputNode {
  if (input.parent_form_type !== 'composite_form') {
    throw new Error(`Invalid parent form type for form input ${input.id}`);
  }

  return {
    id: input.id,
    formId: input.form_id,
    formType: input.form_type,
    formIndex: input.form_index,
    parentId: input.parent_id ?? null,
    parentFormId: input.parent_form_id ?? null,
    parentFormType: input.parent_form_type,
    fieldInputs: input.fieldInputs.map((fieldInput) => {
      if (fieldInput.form_type !== 'simple_form') {
        throw new Error(`Invalid form type for field input ${fieldInput.id}`);
      }

      return {
        id: fieldInput.id,
        fieldId: fieldInput.field_id,
        formInputId: fieldInput.form_input_id,
        formId: fieldInput.form_id,
        formType: fieldInput.form_type,
        value: fieldInput.value ?? null,
      };
    }),
    children: input.children.map(toFormInputNode),
  };
}

/**
 * Returns every input of the requested form (including inputs used by a parent
 * form), each with its complete descendant tree. Field values remain as stored.
 * Passing no form ID leaves the query disabled.
 */
export function useFormInputNodes(formId: Maybe<number>) {
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
      const nodes = await Promise.all(
        sortInputs(inputs).map((input) => loadRecord(input))
      );
      return nodes.map(toFormInputNode);
    },
  });
}
