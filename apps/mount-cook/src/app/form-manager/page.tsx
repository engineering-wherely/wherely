'use client';

import AdminAccess from '@/app/form-manager/components/AdminAccess';
import {
  FieldEditor,
  FormEditor,
} from '@/app/form-manager/components/DefinitionEditor';
import Split from '@/app/form-manager/components/Split';
import type {
  ADSComposition,
  ADSForm,
  ADSFormInput,
  ADSOccurrence,
} from '@/app/form-manager/data';
import {
  buildHierarchy,
  useCatalog,
  useFields,
  useInputDetails,
  useInputs,
} from '@/app/form-manager/data';
import type { Nullable } from 'np-westland/types';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tree } from 'react-arborist';

const buttonClass =
  'rounded border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600';

function Panel({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        {actions}
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="p-5 text-sm text-slate-500">
      {children}
    </p>
  );
}

function QueryError({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div role="alert" className="space-y-3 p-4 text-sm text-red-700">
      <p>{error.message}</p>
      <button className={buttonClass} onClick={retry}>
        Try again
      </button>
    </div>
  );
}

function Hierarchy({
  nodes,
  selected,
  onSelect,
}: {
  nodes: ADSOccurrence[];
  selected: Nullable<ADSOccurrence>;
  onSelect: (node: ADSOccurrence) => void;
}) {
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setHeight(Math.max(1, entry.contentRect.height));
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="p-3">
        <input
          aria-label="Search forms and slots"
          placeholder="Search forms and slots…"
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>
      <div ref={ref} className="min-h-0 flex-1" aria-label="Form hierarchy">
        <Tree<ADSOccurrence>
          data={nodes}
          width="100%"
          height={height}
          rowHeight={38}
          indent={18}
          openByDefault={false}
          disableDrag
          disableDrop
          disableEdit
          disableMultiSelection
          disableDeselectOnClick
          selection={selected?.id}
          searchTerm={search}
          searchMatch={(node, term) =>
            node.data.name.toLowerCase().includes(term.toLowerCase())
          }
          onSelect={(nodes) => {
            if (nodes[0]) {
              onSelect(nodes[0].data);
            }
          }}
        >
          {({ node, style }) => (
            <div
              style={style}
              title={`${node.data.name}${node.data.cycle ? ' (cycle; expansion stopped)' : ''}`}
              className={`flex h-full items-center gap-2 pr-3 text-sm ${node.isSelected ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700'} ${node.isFocused ? 'outline outline-1 -outline-offset-1 outline-indigo-400' : ''}`}
            >
              <button
                type="button"
                tabIndex={-1}
                aria-label={node.isOpen ? 'Collapse form' : 'Expand form'}
                disabled={node.isLeaf}
                className="w-5 shrink-0 disabled:opacity-30"
                onClick={(event) => {
                  event.stopPropagation();
                  node.toggle();
                }}
              >
                {node.isLeaf ? '·' : node.isOpen ? '▾' : '▸'}
              </button>
              <span className="truncate">{node.data.name}</span>
              <span className="ml-auto shrink-0 text-xs text-slate-400">
                {node.data.cycle
                  ? 'Cycle'
                  : node.data.form.type === 'composite_form'
                    ? 'Composite'
                    : 'Simple'}
              </span>
            </div>
          )}
        </Tree>
      </div>
    </div>
  );
}

function InputDetails({
  input,
  forms,
  slots,
  trail,
  onNavigate,
}: {
  input: Nullable<ADSFormInput>;
  forms: ADSForm[];
  slots: ADSComposition[];
  trail: ADSFormInput[];
  onNavigate: (trail: ADSFormInput[]) => void;
}) {
  const form = forms.find((item) => item.id === input?.form_id) ?? null;
  const details = useInputDetails(input);
  const fields = useFields(form);
  const childSlots = slots.filter(
    (slot) => slot.composite_form_id === input?.form_id
  );
  return (
    <Panel
      title={
        input ? `Input #${input.id} · ${form?.name ?? 'Form'}` : 'Input details'
      }
      subtitle={
        input?.form_type === 'composite_form'
          ? 'Child inputs grouped by composition slot'
          : 'Field values for the selected input'
      }
    >
      {trail.length > 1 && (
        <nav
          aria-label="Input navigation"
          className="flex flex-wrap gap-2 border-b p-3"
        >
          {trail.map((item, index) => (
            <button
              key={item.id}
              className={buttonClass}
              aria-current={index === trail.length - 1 ? 'page' : undefined}
              onClick={() => {
                onNavigate(trail.slice(0, index + 1));
              }}
            >
              #{item.id} {forms.find((form) => form.id === item.form_id)?.name}
            </button>
          ))}
        </nav>
      )}
      {!input ? (
        <Notice>Select a form input to inspect its values.</Notice>
      ) : details.isPending ? (
        <Notice>Loading input details…</Notice>
      ) : details.isError ? (
        <QueryError
          error={details.error}
          retry={() => {
            void details.refetch();
          }}
        />
      ) : input.form_type === 'simple_form' ? (
        fields.isPending ? (
          <Notice>Loading fields…</Notice>
        ) : fields.isError ? (
          <QueryError
            error={fields.error}
            retry={() => {
              void fields.refetch();
            }}
          />
        ) : !fields.data?.length ? (
          <Notice>This form has no fields.</Notice>
        ) : (
          <dl className="divide-y">
            {fields.data.map((field) => {
              const record = details.data.values.find(
                (value) => value.field_id === field.id
              );
              const value = !record
                ? 'Not recorded'
                : record.value == null
                  ? 'Null value'
                  : record.value === ''
                    ? 'Empty string'
                    : record.value;
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[minmax(100px,1fr)_2fr] gap-4 p-4 text-sm"
                >
                  <dt className="font-medium">
                    {field.name}
                    <span className="block text-xs font-normal text-slate-500">
                      {field.type ?? 'Unspecified type'}
                      {field.required ? ' · Required' : ''}
                    </span>
                  </dt>
                  <dd
                    className={`whitespace-pre-wrap break-words ${!record || record.value == null || record.value === '' ? 'italic text-slate-400' : 'text-slate-700'}`}
                  >
                    {value}
                  </dd>
                </div>
              );
            })}
          </dl>
        )
      ) : childSlots.length === 0 ? (
        <Notice>This composite form has no composition slots.</Notice>
      ) : (
        <div className="divide-y">
          {childSlots.map((slot) => {
            const children = details.data.children.filter(
              (child) => child.composition_id === slot.id
            );
            return (
              <section key={slot.id} className="p-4">
                <h3 className="text-sm font-medium">
                  {slot.name}{' '}
                  <span className="font-normal text-slate-500">
                    →{' '}
                    {forms.find((form) => form.id === slot.member_id)?.name ??
                      `Form #${slot.member_id}`}
                  </span>
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {children.length} inputs · Allowed {slot.min_input_count}–
                  {slot.max_input_count ?? 'unlimited'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {children.length ? (
                    children.map((child) => (
                      <button
                        className={buttonClass}
                        key={child.id}
                        disabled={trail.some(
                          (ancestor) => ancestor.id === child.id
                        )}
                        onClick={() => {
                          onNavigate([...trail, child]);
                        }}
                      >
                        Input #{child.id} · Index {child.index} →
                      </button>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">
                      No child inputs recorded.
                    </span>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

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
