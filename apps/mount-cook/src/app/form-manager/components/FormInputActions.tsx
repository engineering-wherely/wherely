'use client';

import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import useInputActions from '@/app/form-manager/hooks/useInputActions';
import useInputs from '@/app/form-manager/hooks/useInputs';
import type {
  ADSComposition,
  ADSForm,
  ADSFormInput,
} from '@/app/form-manager/types';
import type { Nullable } from 'np-westland/types';
import { useState } from 'react';

const buttonClass =
  'rounded border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed';
const controlClass = 'mt-1 w-full rounded border px-3 py-2 text-sm';

export default function FormInputActions({
  form,
  slots,
  input,
  initialSlot,
  onCreated,
  onRemoved,
}: {
  form: ADSForm;
  slots: ADSComposition[];
  input: Nullable<ADSFormInput>;
  initialSlot: Nullable<number>;
  onCreated: (input: ADSFormInput) => void;
  onRemoved: (id: number) => void;
}) {
  const admin = useAdminAccess();
  const action = useInputActions();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Nullable<ADSFormInput>>(null);
  const [slotId, setSlotId] = useState(initialSlot?.toString() ?? '');
  const [parentId, setParentId] = useState('');
  const [index, setIndex] = useState('0');
  const slot = slots.find(
    (item) => item.id.toString() === slotId && item.member_id === form.id
  );
  const parents = useInputs(
    adding ? (slot?.composite_form_id ?? null) : null,
    null
  );
  const validParent = parents.data?.some(
    (item) => item.id.toString() === parentId
  );
  const validIndex = /^\d+$/.test(index) && Number(index) <= 2147483647;
  const valid =
    validIndex && (!slotId || (!!slot && validParent && !parents.isError));
  return (
    <div className="space-y-3 border-b p-3">
      <div className="flex flex-wrap gap-2">
        <button
          className={buttonClass}
          disabled={!admin || action.isPending}
          onClick={() => {
            setAdding(true);
            setRemoving(null);
            action.reset();
          }}
        >
          Add form input
        </button>
        <button
          className={buttonClass}
          disabled={!admin || !input || action.isPending}
          onClick={() => {
            setRemoving(input);
            setAdding(false);
            action.reset();
          }}
        >
          Remove form input
        </button>
      </div>
      {!admin && (
        <p className="text-xs text-slate-500">
          Sign in as an administrator to add or remove inputs.
        </p>
      )}
      {adding && (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!admin || action.isPending || !valid) {
              return;
            }
            action.mutate(
              {
                kind: 'create-form',
                data: {
                  form_id: form.id,
                  parent_id: slot ? Number(parentId) : null,
                  composition_id: slot?.id ?? null,
                  index: Number(index),
                },
              },
              {
                onSuccess: (result) => {
                  if (result.kind === 'create-form') {
                    onCreated(result.input);
                    setAdding(false);
                  }
                },
              }
            );
          }}
        >
          <p className="text-sm font-medium">New input for {form.name}</p>
          <fieldset className="space-y-3" disabled={action.isPending}>
            <label className="block text-sm">
              Placement
              <select
                className={controlClass}
                value={slotId}
                onChange={(event) => {
                  setSlotId(event.target.value);
                  setParentId('');
                }}
              >
                <option value="">Independent input</option>
                {slots
                  .filter((item) => item.member_id === form.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} · Slot #{item.id} · Parent form #
                      {item.composite_form_id}
                    </option>
                  ))}
              </select>
            </label>
            {slot && (
              <label className="block text-sm">
                Parent input
                <select
                  required
                  className={controlClass}
                  value={parentId}
                  onChange={(event) => {
                    setParentId(event.target.value);
                  }}
                >
                  <option value="">Select a parent input</option>
                  {parents.data?.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      Input #{parent.id}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {slot && parents.isPending && (
              <p role="status" className="text-sm">
                Loading parent inputs…
              </p>
            )}
            {slot && parents.isError && (
              <p role="alert" className="text-sm text-red-700">
                Could not load parent inputs.{' '}
                <button
                  type="button"
                  onClick={() => {
                    void parents.refetch();
                  }}
                >
                  Retry
                </button>
              </p>
            )}
            {slot && parents.isSuccess && !parents.data.length && (
              <p className="text-sm">
                Create an input for the parent form first.
              </p>
            )}
            <label className="block text-sm">
              Index
              <input
                className={controlClass}
                type="number"
                min={0}
                max={2147483647}
                step={1}
                required
                value={index}
                onChange={(event) => {
                  setIndex(event.target.value);
                }}
              />
            </label>
          </fieldset>
          {action.isError && (
            <p role="alert" className="text-sm text-red-700">
              {action.error.message}
            </p>
          )}
          <div className="flex gap-2">
            <button
              className={buttonClass}
              disabled={!admin || action.isPending || !valid}
            >
              {action.isPending ? 'Creating…' : 'Create input'}
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={action.isPending}
              onClick={() => {
                setAdding(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {removing && (
        <div className="space-y-3 text-sm">
          <p>
            Remove input #{removing.id} permanently? Inputs with field values,
            child inputs, or bindings cannot be removed. Remove those
            dependencies first.
          </p>
          {action.isError && (
            <p role="alert" className="text-red-700">
              {action.error.message}
            </p>
          )}
          <div className="flex gap-2">
            <button
              className={`${buttonClass} text-red-700`}
              disabled={!admin || action.isPending}
              onClick={() => {
                action.mutate(
                  { kind: 'remove-form', data: { id: removing.id } },
                  {
                    onSuccess: () => {
                      onRemoved(removing.id);
                      setRemoving(null);
                    },
                  }
                );
              }}
            >
              {action.isPending ? 'Removing…' : 'Confirm removal'}
            </button>
            <button
              className={buttonClass}
              disabled={action.isPending}
              onClick={() => {
                setRemoving(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
