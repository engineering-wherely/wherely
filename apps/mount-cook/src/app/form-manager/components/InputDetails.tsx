import type { Nullable } from 'np-westland/types';
import useFields from '../hooks/useFields';
import useInputDetails from '../hooks/useInputDetails';
import type { ADSComposition, ADSForm, ADSFormInput } from '../types';
import Notice from './Notice';
import Panel from './Panel';
import QueryError from './QueryError';

const buttonClass =
  'rounded border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600';

export default function InputDetails({
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
