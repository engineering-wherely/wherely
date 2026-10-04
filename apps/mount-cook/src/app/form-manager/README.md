# Form Manager editing

The right column contains independently scrolling form and field editors with a
resizable divider. Form name/description and existing field name, description,
type and required flag can be updated. Form identity, type and field ownership
are not editable. Composite forms show their composition slots below the form
editor because they do not own fields.

Saving requires a Cognito user in the `Administrators` group. The Amplify backend
defines email sign-in and grants that group read/update access to `forms` and
`fields` only. Existing public API-key access remains read-only. The UI uses
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
