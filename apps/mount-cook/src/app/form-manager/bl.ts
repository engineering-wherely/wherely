import type { ADSComposition, ADSForm, ADSOccurrence } from './types';

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
