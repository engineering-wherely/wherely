'use client';

import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import useInputActions from '@/app/form-manager/hooks/useInputActions';
import type {
  ADSField,
  ADSFieldInput,
  ADSFormInput,
} from '@/app/form-manager/types';
import type { Nullable } from 'np-westland/types';
import { useState } from 'react';

const buttonClass =
  'rounded border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed';

export default function FieldInputActions({
  input,
  field,
  record,
}: {
  input: ADSFormInput;
  field: ADSField;
  record: Nullable<ADSFieldInput>;
}) {
  const admin = useAdminAccess();
  const action = useInputActions();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [nullValue, setNullValue] = useState(false);
  return (
    <div className="mt-3 space-y-3 not-italic text-slate-700">
      {!open ? (
        <button
          className={buttonClass}
          disabled={!admin || action.isPending}
          title={
            admin ? undefined : 'Sign in as an administrator to change inputs.'
          }
          onClick={() => {
            action.reset();
            setOpen(true);
          }}
        >
          {record ? 'Remove field input' : 'Add field input'}
        </button>
      ) : record ? (
        <div className="space-y-3">
          <p>
            Remove the recorded value for “{field.name}” from input #{input.id}{' '}
            permanently? The field definition will remain.
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
                  { kind: 'remove-field', data: { id: record.id } },
                  {
                    onSuccess: () => {
                      setOpen(false);
                      setValue('');
                      setNullValue(false);
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
                setOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!admin || action.isPending) {
              return;
            }
            action.mutate(
              {
                kind: 'create-field',
                data: {
                  form_input_id: input.id,
                  field_id: field.id,
                  value: nullValue ? null : value,
                },
              },
              {
                onSuccess: () => {
                  setOpen(false);
                  setValue('');
                  setNullValue(false);
                },
              }
            );
          }}
        >
          <label className="block">
            Value for {field.name}
            <textarea
              className="mt-1 w-full rounded border px-3 py-2"
              rows={2}
              disabled={nullValue || action.isPending}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nullValue}
              disabled={action.isPending}
              onChange={(event) => {
                setNullValue(event.target.checked);
              }}
            />
            Record a null value
          </label>
          <p className="text-xs text-slate-500">
            A blank value is recorded as an empty string unless null is
            selected.
          </p>
          {action.isError && (
            <p role="alert" className="text-red-700">
              {action.error.message}
            </p>
          )}
          <div className="flex gap-2">
            <button
              className={buttonClass}
              disabled={!admin || action.isPending}
            >
              {action.isPending ? 'Creating…' : 'Create field input'}
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={action.isPending}
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
