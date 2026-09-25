# Form integrity

`forms` stores both simple and composite definitions, distinguished by `type`.
All form references use foreign keys, including the discriminator where the
relationship requires a particular kind. Generated discriminator columns are
database-maintained; callers must omit them from inserts and updates.

Insert requirements:

- Create forms using `formsTable` with `type: 'simple_form'` or
  `type: 'composite_form'`. The former separate simple/composite tables are gone.
- A field's `simpleFormId` must identify a simple form.
- A composition's owner must be composite; its member ID and type must match an
  existing form.
- Root inputs omit `parentId`, `parentFormId`, and `compositionId`. Independent submissions
  of the same form are allowed. Child inputs supply all three values; the parent must
  be a composite input and the composition slot must belong to that parent form
  and reference the child's form and type. Repeated instances are indexed within
  each slot, so distinct slots can reuse the same member form.
- Field inputs supply `formId` in addition to `formInputId` and `fieldId`. Both
  references must belong to that same simple form.
- Input bindings supply `formId` and `formType` in addition to the binding and
  input IDs. Both references must match that form identity.

Null subject IDs retain the meaning of type-wide bindings. Binding unique keys
use `NULLS NOT DISTINCT` (PostgreSQL 15+) so a null subject does not permit
duplicate bindings. Referenced records cannot be deleted or reassigned until
their dependents are removed or updated; these constraints do not cascade deletes.

## Existing databases

These are schema definitions, not a data migration. Before applying them to an
existing database, merge simple and composite definitions into `forms` and remap
their IDs and every dependent reference; their old ID sequences can overlap.
Backfill the new input identity columns, including `compositionId` for children,
while the old parent/member mapping is still unambiguous. Resolve inconsistent references and
duplicate null-subject bindings, then add the constraints. Regenerate the Amplify
SQL schema after migrating the database. Do not use an automatic drop/recreate
operation against populated tables as a substitute for this migration.

## Verification

Run `pnpm --filter lake-pukaki test:schema`. Docker must be running and the
`nickblah/postgis:18-postgis-3.6.4` image from this package's Compose file must be
available locally. The test generates SQL from the actual Drizzle definitions,
applies it to a disposable container, tests valid and invalid writes, then removes
that container. It does not load `.env` or connect to the application database.

The member instance position is `index` (previously `form_index`). Existing
databases need a column rename and regenerated Amplify SQL schema; the current
client adapter maps the generated API's `form_index` to `index` until regeneration.
