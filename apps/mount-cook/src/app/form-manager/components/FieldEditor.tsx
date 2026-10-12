'use client';

import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import { useSaveDefinition } from '@/app/form-manager/hooks/useSaveDefinition';
import { useState } from 'react';
import type { ADSField } from '../types';

const controlClass =
  'mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-indigo-500';
const buttonClass =
  'rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50';

const saveUnavailable = 'Sign in as an administrator to save changes.';

export default function FieldEditor({ field }: { field: ADSField }) {
  const canEdit = useAdminAccess();
  const save = useSaveDefinition();
  const [name, setName] = useState(field.name);
  const [description, setDescription] = useState(field.description ?? '');
  const [type, setType] = useState<NonNullable<ADSField['type']> | ''>(
    field.type ?? ''
  );
  const [required, setRequired] = useState(field.required);
  const dirty =
    name !== field.name ||
    description !== (field.description ?? '') ||
    type !== (field.type ?? '') ||
    required !== field.required;
  return (
    <details className="border-b" open>
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
        {field.name}{' '}
        <span className="font-normal text-slate-500">· #{field.id}</span>
      </summary>
      <form
        className="space-y-3 px-4 pb-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canEdit || save.isPending) {
            return;
          }
          save.mutate({
            kind: 'field',
            data: {
              id: field.id,
              name: name.trim(),
              description: description || null,
              type: type || null,
              required,
            },
          });
        }}
      >
        <label className="block text-sm">
          Field name
          <input
            className={controlClass}
            required
            maxLength={256}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </label>
        <label className="block text-sm">
          Field type
          <select
            className={controlClass}
            value={type}
            onChange={(event) => {
              setType(event.target.value as typeof type);
            }}
          >
            <option value="">Unspecified</option>
            {['text', 'number', 'boolean', 'datetime', 'json', 'link'].map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              )
            )}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={required}
            onChange={(event) => {
              setRequired(event.target.checked);
            }}
          />
          Required
        </label>
        <label className="block text-sm">
          Field description
          <textarea
            className={controlClass}
            rows={2}
            maxLength={512}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </label>
        {save.isError && (
          <p role="alert" className="text-sm text-red-700">
            {save.error.message}
          </p>
        )}
        {save.isSuccess && !dirty && (
          <p role="status" className="text-xs text-green-700">
            Saved.
          </p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className={buttonClass}
            disabled={!canEdit || !dirty || save.isPending || !name.trim()}
            title={
              canEdit
                ? 'Changes apply to every use of this definition.'
                : saveUnavailable
            }
          >
            {save.isPending ? 'Saving…' : 'Save field'}
          </button>
          <button
            type="button"
            className={buttonClass}
            disabled={!dirty || save.isPending}
            onClick={() => {
              setName(field.name);
              setDescription(field.description ?? '');
              setType(field.type ?? '');
              setRequired(field.required);
            }}
          >
            Reset
          </button>
          {dirty && (
            <span role="status" className="text-xs text-amber-700">
              Unsaved changes
            </span>
          )}
        </div>
      </form>
    </details>
  );
}
