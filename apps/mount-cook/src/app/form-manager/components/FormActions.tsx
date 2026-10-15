'use client';

import { useAdminAccess } from '@/app/form-manager/components/AdminAccess';
import type { ADSForm } from '@/app/form-manager/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/data';
import type { AmplifyDataSchema } from 'lake-pukaki';
import type { Nullable } from 'np-westland/types';
import { useState } from 'react';

const buttonClass =
  'rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50';
const controlClass = 'mt-1 w-full rounded-md border px-3 py-2 text-sm';
type ADSFormDraft = Pick<ADSForm, 'name' | 'description' | 'type'>;

export default function FormActions({
  form,
  onCreated,
  onDeleted,
}: {
  form: Nullable<ADSForm>;
  onCreated: (form: ADSForm) => void;
  onDeleted: (id: number) => void;
}) {
  const admin = useAdminAccess();
  const cache = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Nullable<ADSForm>>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ADSForm['type']>('simple_form');
  const refresh = () => cache.invalidateQueries({ queryKey: ['form-manager'] });
  const create = useMutation({
    mutationFn: async (draft: ADSFormDraft) => {
      if (!admin || !draft.name.trim()) {
        throw new Error('An administrator and a form name are required.');
      }
      const client = generateClient<AmplifyDataSchema>({
        authMode: 'userPool',
      });
      const result = await client.mutations.createFormDefinition(draft);
      if (result.errors?.length) {
        throw new Error(result.errors.map((error) => error.message).join('; '));
      }
      const created = result.data?.[0];
      if (!created) {
        throw new Error('The form was not created. Refresh and try again.');
      }
      return created;
    },
    onSuccess: async (created) => {
      await refresh();
      onCreated(created);
      setAdding(false);
      setName('');
      setDescription('');
      setType('simple_form');
    },
  });
  const remove = useMutation({
    mutationFn: async (id: number) => {
      if (!admin) {
        throw new Error('Sign in as an administrator to remove forms.');
      }
      const client = generateClient<AmplifyDataSchema>({
        authMode: 'userPool',
      });
      const result = await client.models.forms.delete({ id });
      if (result.errors?.length) {
        throw new Error(
          `Could not remove the form. Forms with fields, inputs, composition slots, or bindings cannot be removed. ${result.errors.map((error) => error.message).join('; ')}`
        );
      }
      if (!result.data) {
        throw new Error('The form was not removed. Refresh and try again.');
      }
      return id;
    },
    onSuccess: async (id) => {
      onDeleted(id);
      setDeleting(null);
      await refresh();
    },
  });
  const pending = create.isPending || remove.isPending;
  return (
    <div className="shrink-0 space-y-3 border-b p-3">
      <div className="flex flex-wrap gap-2">
        <button
          className={buttonClass}
          disabled={!admin || pending}
          onClick={() => {
            setAdding(true);
            setDeleting(null);
            create.reset();
          }}
        >
          Add form
        </button>
        <button
          className={buttonClass}
          disabled={!admin || !form || pending}
          onClick={() => {
            setDeleting(form);
            setAdding(false);
            remove.reset();
          }}
        >
          Remove form
        </button>
      </div>
      {!admin && (
        <p className="text-xs text-slate-500">
          Sign in as an administrator to add or remove forms.
        </p>
      )}
      {adding && (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!admin || pending) {
              return;
            }
            create.mutate({
              name: name.trim(),
              description: description || null,
              type,
            });
          }}
        >
          <label className="block text-sm">
            Name
            <input
              autoFocus
              className={controlClass}
              required
              maxLength={256}
              value={name}
              disabled={pending}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </label>
          <label className="block text-sm">
            Type
            <select
              className={controlClass}
              value={type}
              disabled={pending}
              onChange={(event) => {
                setType(
                  event.target.value === 'composite_form'
                    ? 'composite_form'
                    : 'simple_form'
                );
              }}
            >
              <option value="simple_form">Simple form</option>
              <option value="composite_form">Composite form</option>
            </select>
          </label>
          <label className="block text-sm">
            Description
            <textarea
              className={controlClass}
              maxLength={512}
              rows={2}
              value={description}
              disabled={pending}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
          </label>
          {create.isError && (
            <p role="alert" className="text-sm text-red-700">
              {create.error.message}
            </p>
          )}
          <div className="flex gap-2">
            <button
              className={buttonClass}
              disabled={!admin || pending || !name.trim()}
            >
              {create.isPending ? 'Creating…' : 'Create form'}
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={pending}
              onClick={() => {
                setAdding(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {deleting && (
        <div className="space-y-3 text-sm">
          <p>
            Remove “{deleting.name}” (#{deleting.id}) permanently? This deletes
            the form definition everywhere it appears. Unsaved edits will be
            discarded.
          </p>
          <p className="text-xs text-slate-500">
            Forms with fields, inputs, composition slots, or bindings cannot be
            removed.
          </p>
          {remove.isError && (
            <p role="alert" className="text-red-700">
              {remove.error.message}
            </p>
          )}
          <div className="flex gap-2">
            <button
              className={`${buttonClass} text-red-700`}
              disabled={!admin || pending}
              onClick={() => {
                remove.mutate(deleting.id);
              }}
            >
              {remove.isPending ? 'Removing…' : 'Confirm removal'}
            </button>
            <button
              className={buttonClass}
              disabled={pending}
              onClick={() => {
                setDeleting(null);
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
