import { makeForeignId, makeId, makeName } from "@/db/column-helpers";
import {
  boolean,
  integer,
  pgEnum,
  snakeCase,
  text,
  unique,
} from "drizzle-orm/pg-core";

export const formsTable = snakeCase.table("forms", {
  id: makeId(),
  name: makeName(),
});

export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "number",
  "boolean",
  "datetime",
  "json",
  "link",
]);

export const fieldsTable = snakeCase.table("fields", {
  id: makeId(),
  name: makeName(),
  type: fieldTypeEnum(),
  required: boolean().notNull().default(true),
  formId: makeForeignId(formsTable.id),
});

export const compositeFormsTable = snakeCase.table("composite_forms", {
  id: makeId(),
  name: makeName(),
});

export const compositeFormMembersTable = snakeCase.table(
  "composite_form_members",
  {
    id: makeId(),
    compositeFormId: makeForeignId(compositeFormsTable.id),
    formId: makeForeignId(formsTable.id),
    formInputMin: integer().default(1),
    formInputMax: integer(),
    formInputCount: integer(),
  },
  (t) => [unique().on(t.compositeFormId, t.formId)],
);

export const formInputsTable = snakeCase.table("form_inputs", {
  id: makeId(),
  compositeFormId: makeForeignId(compositeFormsTable.id),
  formId: makeForeignId(formsTable.id).notNull(),
  formIndex: integer().notNull().default(0),
});

export const fieldInputsTable = snakeCase.table("field_inputs", {
  id: makeId(),
  value: text(),
  formInputId: makeForeignId(formInputsTable.id),
  fieldId: makeForeignId(fieldsTable.id),
});
