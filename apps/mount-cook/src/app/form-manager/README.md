# Form Manager editing

The right column contains independently scrolling form and field editors with a
resizable divider. Form name/description and existing field name, description,
type and required flag can be updated. Form identity, type and field ownership
are not editable. Composite forms show their composition slots below the form
editor because they do not own fields.

Saving requires a Cognito user in the `Administrators` group. The Amplify backend
defines email sign-in and grants that group read/update/delete access to `forms`
and `fields`. Administrator-only `createFormDefinition` and
`createFieldDefinition` mutations create definitions using database-generated IDs. Existing public API-key access remains read-only. The UI uses
`userPool` authorization for mutations and reports server errors without clearing
the draft. Successful saves invalidate the Form Manager queries.

To enable editing in an environment:

1. Deploy the updated lake-pukaki Amplify backend through the project's normal
   sandbox or deployment workflow.
2. Refresh `lake-pukaki/amplify_outputs.json` through Amplify (do not hand-edit it)
   and restart/rebuild mount-cook.
3. Provision the intended administrator in the deployed Cognito user pool and
   add that account to `Administrators` through the AWS administration workflow.
4. Use Administrator sign-in on Form Manager.

No accounts or group memberships are provisioned by this feature. Until auth
outputs exist, browsing remains available and saving stays disabled.

The current schema has no `is_builtin` property. Built-in definition protection
requires a separate database/API change; this editor does not claim to enforce it.

The left column provides Add form and Remove form controls for administrators.
New forms require a name and either a simple or composite type; description is
optional. Creation refreshes the hierarchy and selects the new form. Removal
requires confirmation of the named definition (including when selected through
a composition slot), clears the selection after success, and refreshes queries.
Database foreign keys reject removal of forms with fields, inputs, composition
slots, or bindings; errors keep the confirmation open. No related records are
automatically deleted. Deploy the updated backend before using these controls.

The Fields section offers Add field for the selected simple form, including when
it has no fields. Name, optional description, type (including unspecified), and
the required flag can be set. Each existing field has a Remove field action with
a confirmation naming that field. Fields with recorded inputs cannot be deleted;
database foreign keys enforce this protection. Successful changes refresh Form
Manager queries, while failed requests retain the draft or confirmation. Switching
forms resets the creation draft so it cannot be submitted to another form.

The middle column supports administrator-only creation and removal of form inputs.
Choose independent placement or a composition slot, its parent input, and a
non-negative index. The slot-only view defaults creation to that slot. Creation
selects the new input; removal clears its details after confirmation. Form inputs
with child inputs, field values, or bindings cannot be deleted.

For simple form inputs, each field in Input Details offers Add field input when
no value exists, or Remove field input when recorded. A blank text value is an
empty string; the null checkbox records SQL NULL. Removing a value preserves its
field definition. The API derives ownership from the selected form/input and the
database enforces matching ownership, slot membership, and uniqueness. Deploy the
updated backend to enable the administrator mutations and delete permissions.
