'use client';

import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import { useSaveDefinition } from '@/app/form-manager/hooks/useSaveDefinition';
import { useState } from 'react';
import type { ADSForm } from '../types';

const controlClass =
  'mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-indigo-500';
const buttonClass =
  'rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50';

const saveUnavailable = 'Sign in as an administrator to save changes.';

export default function FormEditor({ form }: { form: ADSForm }) {
  const canEdit = useAdminAccess();
  const save = useSaveDefinition();
  const [name, setName] = useState(form.name);
  const [description, setDescription] = useState(form.description ?? '');
  const dirty = name !== form.name || description !== (form.description ?? '');
  return (
    <form
      className="space-y-4 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canEdit || save.isPending) {
          return;
        }
        save.mutate({
          kind: 'form',
          data: {
            id: form.id,
            name: name.trim(),
            description: description || null,
          },
        });
      }}
    >
      <label className="block text-sm font-medium">
        Name
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
      <label className="block text-sm font-medium">
        Description
        <textarea
          className={controlClass}
          rows={3}
          maxLength={512}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
      </label>
      <dl className="flex flex-wrap gap-4 text-xs text-slate-500">
        <div>
          <dt>Form ID</dt>
          <dd className="mt-1 text-slate-800">#{form.id}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd className="mt-1 text-slate-800">
            {form.type === 'simple_form' ? 'Simple form' : 'Composite form'}
          </dd>
        </div>
      </dl>
      <p className="text-xs text-slate-500">
        {canEdit
          ? 'Changes apply to every use of this definition.'
          : saveUnavailable}
      </p>
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
          {save.isPending ? 'Saving…' : 'Save form'}
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={!dirty || save.isPending}
          onClick={() => {
            setName(form.name);
            setDescription(form.description ?? '');
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
  );
}
