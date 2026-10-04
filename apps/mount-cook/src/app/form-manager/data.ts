import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';
import type { Maybe, Nullable } from 'np-westland/types';

export type ADSForm = AmplifyDataSchema['forms']['type'];
export type ADSComposition = AmplifyDataSchema['form_compositions']['type'];
export type ADSFormInput = AmplifyDataSchema['form_inputs']['type'];
export type ADSField = AmplifyDataSchema['fields']['type'];
export type ADSFieldInput = AmplifyDataSchema['field_inputs']['type'];
export type ADSOccurrence = {
  id: string;
  name: string;
  form: ADSForm;
  slot?: ADSComposition;
  cycle: boolean;
  children?: ADSOccurrence[];
};

type Page<T> = {
  data: T[];
  nextToken?: Maybe<string>;
  errors?: readonly { message: string }[];
};

async function listAll<T>(
  fetch: (nextToken?: Maybe<string>) => Promise<Page<T>>
) {
  const records: T[] = [];
  let token: Maybe<string>;
  do {
    const page = await fetch(token);
    if (page.errors?.length) {
      throw new Error(page.errors.map((error) => error.message).join('; '));
    }
    records.push(...page.data);
    token = page.nextToken;
  } while (token);
  return records;
}

export function buildHierarchy(
  forms: ADSForm[],
  slots: ADSComposition[]
): ADSOccurrence[] {
  const byId = new Map(forms.map((form) => [form.id, form]));
  const byParent = new Map<number, ADSComposition[]>();
  for (const slot of slots) {
    const siblings = byParent.get(slot.composite_form_id) ?? [];
    siblings.push(slot);
    byParent.set(slot.composite_form_id, siblings);
  }
  function visit(
    form: ADSForm,
    path: string,
    ancestors: Set<number>,
    slot?: ADSComposition
  ): ADSOccurrence {
    const cycle = ancestors.has(form.id);
    const next = new Set(ancestors).add(form.id);
    return {
      id: path,
      name: slot ? `${slot.name} → ${form.name}` : form.name,
      form,
      slot,
      cycle,
      children:
        form.type === 'composite_form' && !cycle
          ? (byParent.get(form.id) ?? []).flatMap((child) => {
              const member = byId.get(child.member_id);
              if (!member) {
                return [];
              }
              return [visit(member, `${path}/slot:${child.id}`, next, child)];
            })
          : undefined,
    };
  }
  // Every definition is a root too, so reused and cyclic definitions remain discoverable.
  return [...forms]
    .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id)
    .map((form) => visit(form, `form:${form.id}`, new Set()));
}

export function useCatalog() {
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

export function useInputs(formId: Nullable<number>, slotId: Nullable<number>) {
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

export function useFields(form: Nullable<ADSForm>) {
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

export function useInputDetails(input: Nullable<ADSFormInput>) {
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
