'use client';
import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import useFieldActions from '@/app/form-manager/hooks/useFieldActions';
import type { ADSField, ADSForm } from '@/app/form-manager/types';
import { useState } from 'react';
const controlClass =
  'mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-indigo-500';
const buttonClass =
  'rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50';
export default function AddField({ form }: { form: ADSForm }) {
  const admin = useAdminAccess();
  const { create } = useFieldActions();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<NonNullable<ADSField['type']> | ''>('text');
  const [required, setRequired] = useState(true);
  return (
    <div className="border-b p-4">
      {!adding ? (
        <button
          type="button"
          className={buttonClass}
          disabled={!admin}
          onClick={() => {
            create.reset();
            setAdding(true);
          }}
        >
          Add field
        </button>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!admin || create.isPending || form.type !== 'simple_form') {
              return;
            }
            create.mutate(
              {
                name: name.trim(),
                description: description || null,
                type: type || null,
                required,
                simple_form_id: form.id,
              },
              {
                onSuccess: () => {
                  setAdding(false);
                  setName('');
                  setDescription('');
                  setType('text');
                  setRequired(true);
                },
              }
            );
          }}
        >
          <p className="text-sm font-medium">New field for {form.name}</p>
          <fieldset disabled={create.isPending} className="space-y-3">
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
          </fieldset>
          {create.isError && (
            <p role="alert" className="text-sm text-red-700">
              {create.error.message}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className={buttonClass}
              disabled={!admin || create.isPending || !name.trim()}
            >
              {create.isPending ? 'Creating…' : 'Create field'}
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={create.isPending}
              onClick={() => {
                setAdding(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {!admin && (
        <p className="mt-2 text-xs text-slate-500">
          Sign in as an administrator to add or remove fields.
        </p>
      )}
    </div>
  );
}
