'use client';

import { buildHierarchy } from '@/app/form-manager/bl';
import AddField from '@/app/form-manager/components/AddField';
import AdminAccess from '@/app/form-manager/components/AdminAccess';
import FieldEditor from '@/app/form-manager/components/FieldEditor';
import FormActions from '@/app/form-manager/components/FormActions';
import FormEditor from '@/app/form-manager/components/FormEditor';
import FormInputActions from '@/app/form-manager/components/FormInputActions';
import Hierarchy from '@/app/form-manager/components/Hierarchy';
import InputDetails from '@/app/form-manager/components/InputDetails';
import Notice from '@/app/form-manager/components/Notice';
import Panel from '@/app/form-manager/components/Panel';
import QueryError from '@/app/form-manager/components/QueryError';
import Split from '@/app/form-manager/components/Split';
import useCatalog from '@/app/form-manager/hooks/useCatalog';
import useFields from '@/app/form-manager/hooks/useFields';
import useInputs from '@/app/form-manager/hooks/useInputs';
import type { ADSFormInput, ADSOccurrence } from '@/app/form-manager/types';
import type { Nullable } from 'np-westland/types';
import { useMemo, useState } from 'react';

export default function FormManagerPage() {
  const catalog = useCatalog();
  const [selected, setSelected] = useState<Nullable<ADSOccurrence>>(null);
  const [slotOnly, setSlotOnly] = useState(false);
  const [trail, setTrail] = useState<ADSFormInput[]>([]);
  const form =
    catalog.data?.forms.find((item) => item.id === selected?.form.id) ?? null;
  const inputs = useInputs(
    form?.id ?? null,
    slotOnly ? (selected?.slot?.id ?? null) : null
  );
  const fields = useFields(form);
  const hierarchy = useMemo(
    () => buildHierarchy(catalog.data?.forms ?? [], catalog.data?.slots ?? []),
    [catalog.data]
  );
  const forms = catalog.data?.forms ?? [];
  const slots = catalog.data?.slots ?? [];
  const select = (node: ADSOccurrence) => {
    if (node.id !== selected?.id) {
      setSelected(node);
      setSlotOnly(false);
      setTrail([]);
    }
  };
  const inputPanel = (
    <Panel
      title={form ? `${form.name} · Form inputs` : 'Form inputs'}
      subtitle={
        slotOnly
          ? `Only inputs in ${selected?.slot?.name}`
          : 'All instances, including inputs used by parent forms'
      }
      actions={
        selected?.slot && (
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={slotOnly}
              onChange={(event) => {
                setSlotOnly(event.target.checked);
                setTrail([]);
              }}
            />
            This slot only
          </label>
        )
      }
    >
      {form && (
        <FormInputActions
          key={`${form.id}:${slotOnly ? selected?.slot?.id : 'all'}`}
          form={form}
          slots={slots}
          input={trail[0]?.form_id === form.id ? trail[0] : null}
          initialSlot={slotOnly ? (selected?.slot?.id ?? null) : null}
          onCreated={(created) => {
            if (slotOnly && created.composition_id !== selected?.slot?.id) {
              setSlotOnly(false);
            }
            setTrail([created]);
          }}
          onRemoved={(id) => {
            setTrail((current) =>
              current.some((item) => item.id === id) ? [] : current
            );
          }}
        />
      )}
      {!form ? (
        <Notice>Select a form from the hierarchy.</Notice>
      ) : inputs.isPending ? (
        <Notice>Loading form inputs…</Notice>
      ) : inputs.isError ? (
        <QueryError
          error={inputs.error}
          retry={() => {
            void inputs.refetch();
          }}
        />
      ) : inputs.data.length === 0 ? (
        <Notice>No form inputs in this scope.</Notice>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs text-slate-500">
            <tr>
              {['Input', 'Parent input', 'Slot', 'Index'].map((heading) => (
                <th className="p-3 font-medium" key={heading}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {inputs.data.map((input) => (
              <tr
                key={input.id}
                className={
                  trail[0]?.id === input.id
                    ? 'bg-indigo-50'
                    : 'hover:bg-slate-50'
                }
              >
                <td className="p-3">
                  <button
                    className="rounded font-medium text-indigo-700 underline-offset-4 hover:underline focus-visible:outline-2"
                    aria-pressed={trail[0]?.id === input.id}
                    onClick={() => {
                      setTrail([input]);
                    }}
                  >
                    #{input.id}
                  </button>
                </td>
                <td className="p-3 text-slate-500">
                  {input.parent_id == null
                    ? 'Independent'
                    : `#${input.parent_id} · ${forms.find((item) => item.id === input.parent_form_id)?.name ?? 'Parent'}`}
                </td>
                <td className="p-3 text-slate-500">
                  {slots.find((slot) => slot.id === input.composition_id)
                    ?.name ?? '—'}
                </td>
                <td className="p-3">{input.index}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
  const definitionPanel = (
    <Split
      vertical
      initial={45}
      label="Resize form and field editors"
      first={
        <Panel
          title="Form details"
          subtitle={form ? form.name : 'Selected form'}
        >
          {form ? (
            <FormEditor key={form.id} form={form} />
          ) : (
            <Notice>Select a form to view and edit its details.</Notice>
          )}
        </Panel>
      }
      second={
        <Panel
          title="Fields"
          subtitle={
            form
              ? `${form.name} · Field definitions`
              : 'Fields of the selected form'
          }
        >
          {form?.type === 'simple_form' && (
            <AddField key={form.id} form={form} />
          )}
          {!form ? (
            <Notice>Select a form to view and edit its fields.</Notice>
          ) : form.type === 'composite_form' ? (
            <>
              <Notice>
                Composite forms contain composition slots rather than fields.
              </Notice>
              {slots
                .filter((slot) => slot.composite_form_id === form.id)
                .map((slot) => (
                  <article className="border-b p-4 text-sm" key={slot.id}>
                    <h3 className="font-medium">{slot.name}</h3>
                    <p className="mt-1 text-slate-500">
                      {forms.find((member) => member.id === slot.member_id)
                        ?.name ?? `Form #${slot.member_id}`}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Inputs: {slot.min_input_count}–
                      {slot.max_input_count ?? 'unlimited'}
                    </p>
                  </article>
                ))}
            </>
          ) : fields.isPending ? (
            <Notice>Loading fields…</Notice>
          ) : fields.isError ? (
            <QueryError
              error={fields.error}
              retry={() => {
                void fields.refetch();
              }}
            />
          ) : !fields.data?.length ? (
            <Notice>No fields defined.</Notice>
          ) : (
            <div key={form.id}>
              <p className="border-b p-4 text-xs text-slate-500">
                Edit field definitions below. Only administrators can save
                changes.
              </p>
              {fields.data.map((field) => (
                <FieldEditor key={field.id} field={field} />
              ))}
            </div>
          )}
        </Panel>
      }
    />
  );
  return (
    <main className="flex h-dvh flex-col bg-slate-100 text-slate-900">
      <AdminAccess>
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Form Manager
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Explore form definitions and their recorded inputs.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            {forms.length} forms
          </span>
        </header>
        <div className="min-h-0 flex-1 overflow-x-auto p-3">
          <div className="h-full min-w-[1000px] overflow-hidden rounded-lg border shadow-sm">
            <Split
              initial={24}
              label="Resize form hierarchy"
              first={
                <Panel
                  title="All forms"
                  subtitle="Expand a composite form to explore its slots"
                >
                  <div className="flex h-full min-h-0 flex-col">
                    <FormActions
                      form={form}
                      onCreated={(created) => {
                        select({
                          id: `form:${created.id}`,
                          name: created.name,
                          form: created,
                          cycle: false,
                        });
                      }}
                      onDeleted={(id) => {
                        setSelected((current) =>
                          current?.form.id === id ? null : current
                        );
                        setSlotOnly(false);
                        setTrail([]);
                      }}
                    />
                    <div className="min-h-0 flex-1">
                      {catalog.isPending ? (
                        <Notice>Loading form hierarchy…</Notice>
                      ) : catalog.isError ? (
                        <QueryError
                          error={catalog.error}
                          retry={() => {
                            void catalog.refetch();
                          }}
                        />
                      ) : !forms.length ? (
                        <Notice>No forms have been created yet.</Notice>
                      ) : (
                        <Hierarchy
                          nodes={hierarchy}
                          selected={selected}
                          onSelect={select}
                        />
                      )}
                    </div>
                  </div>
                </Panel>
              }
              second={
                <Split
                  initial={65}
                  label="Resize definition panel"
                  first={
                    <Split
                      vertical
                      initial={48}
                      label="Resize input details"
                      first={inputPanel}
                      second={
                        <InputDetails
                          input={trail.at(-1) ?? null}
                          forms={forms}
                          slots={slots}
                          trail={trail}
                          onNavigate={setTrail}
                        />
                      }
                    />
                  }
                  second={definitionPanel}
                />
              }
            />
          </div>
        </div>
      </AdminAccess>
    </main>
  );
}
