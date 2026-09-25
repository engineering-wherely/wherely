# Coding conventions

- Don't use deprecated APIs.
- When wrapping a component defined in np-westland in mount-cook, add the NPW
  as a prefix to the name of the wrapped component. Refer to YearMonthRangeListControl.tsx
  defined in mount-cook as an example.
- Use configured path aliases instead of relative paths for imports.
- Automatically run VS Code's `Organize Imports` command after changing imports
  in a file.
- Run `pnpm --filter np-westland run build` every time np-westland is changed.
- Always use braces and multiline bodies for conditional statements, including
  single-statement guards. Never write `if (condition) return;`.
- Use the existing `Nullable<T>` type instead of `T | null`.
- Use the existing `Optional<T>` type instead of `T | undefined`.
- Use the existing `Maybe<T>` type instead of `T | null | undefined` or nested
  combinations of `Nullable<T>` and `Optional<T>`.
- Import these types from `@/types/common` within np-westland, or from
  `np-westland/types` in consuming apps. Do not redefine them. Preserve the
  intended distinction between `null`, `undefined`, and both. Keep optional
  property and parameter syntax (`?`) when omission is intended.
- Apply these conventions to new and modified code. Do not edit generated files.
- Add `ADS` as a prefix to the names of types derived from the AmplifyDataSchema type.
  Refer to ADSFormInput in useFormInputNodes hook in mount-cook as an example.
