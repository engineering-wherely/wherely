import { makeForeignId, makeId, makeName } from "@/db/column-helpers";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  foreignKey,
  integer,
  pgEnum,
  snakeCase,
  text,
  unique,
} from "drizzle-orm/pg-core";

export const formType = pgEnum("form_type", ["simple_form", "composite_form"]);

// Both kinds share an ID namespace so every form reference can be a foreign key.
export const formsTable = snakeCase.table(
  "forms",
  {
    id: makeId(),
    name: makeName(),
    type: formType().notNull(),
  },
  (t) => [unique().on(t.id, t.type)],
);

export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "number",
  "boolean",
  "datetime",
  "json",
  "link",
]);

export const fieldsTable = snakeCase.table(
  "fields",
  {
    id: makeId(),
    name: makeName(),
    type: fieldTypeEnum(),
    required: boolean().notNull().default(true),
    simpleFormId: makeForeignId(formsTable.id).notNull(),
    formType: formType()
      .generatedAlwaysAs(sql`'simple_form'::form_type`)
      .notNull(),
  },
  (t) => [
    unique().on(t.id, t.simpleFormId),
    foreignKey({
      columns: [t.simpleFormId, t.formType],
      foreignColumns: [formsTable.id, formsTable.type],
    }),
  ],
);

export const formCompositionsTable = snakeCase.table(
  "form_compositions",
  {
    id: makeId(),
    compositeFormId: makeForeignId(formsTable.id).notNull(),
    compositeFormType: formType()
      .generatedAlwaysAs(sql`'composite_form'::form_type`)
      .notNull(),
    memberType: formType().notNull(),
    memberId: bigint({ mode: "number" }).notNull(),
    memberMin: integer().default(1),
    memberMax: integer(),
    memberCount: integer().default(1),
  },
  (t) => [
    unique().on(t.compositeFormId, t.memberType, t.memberId),
    foreignKey({
      columns: [t.compositeFormId, t.compositeFormType],
      foreignColumns: [formsTable.id, formsTable.type],
    }),
    foreignKey({
      columns: [t.memberId, t.memberType],
      foreignColumns: [formsTable.id, formsTable.type],
    }),
  ],
);

export const formInputsTable = snakeCase.table(
  "form_inputs",
  {
    id: makeId(),
    parentId: bigint({ mode: "number" }),
    // Supplied together with parentId; the foreign keys verify the copied identity.
    parentFormId: bigint({ mode: "number" }),
    parentFormType: formType()
      .generatedAlwaysAs(sql`'composite_form'::form_type`)
      .notNull(),
    formType: formType().notNull(),
    formId: bigint({ mode: "number" }).notNull(),
    formIndex: integer().notNull().default(0),
  },
  (t) => [
    unique().on(t.id, t.formId, t.formType),
    // Null parents represent independent root submissions, which may repeat.
    unique().on(t.parentId, t.formId, t.formType, t.formIndex),
    check(
      "form_inputs_parent_pair",
      sql`(${t.parentId} IS NULL) = (${t.parentFormId} IS NULL)`,
    ),
    foreignKey({
      columns: [t.formId, t.formType],
      foreignColumns: [formsTable.id, formsTable.type],
    }),
    foreignKey({
      name: "form_inputs_parent_fk",
      columns: [t.parentId, t.parentFormId, t.parentFormType],
      foreignColumns: [t.id, t.formId, t.formType],
    }),
    foreignKey({
      name: "form_inputs_member_fk",
      columns: [t.parentFormId, t.formType, t.formId],
      foreignColumns: [
        formCompositionsTable.compositeFormId,
        formCompositionsTable.memberType,
        formCompositionsTable.memberId,
      ],
    }),
  ],
);

export const fieldInputsTable = snakeCase.table(
  "field_inputs",
  {
    id: makeId(),
    value: text(),
    formInputId: makeForeignId(formInputsTable.id).notNull(),
    fieldId: makeForeignId(fieldsTable.id).notNull(),
    formId: bigint({ mode: "number" }).notNull(),
    formType: formType()
      .generatedAlwaysAs(sql`'simple_form'::form_type`)
      .notNull(),
  },
  (t) => [
    unique().on(t.formInputId, t.fieldId),
    foreignKey({
      name: "field_inputs_form_input_fk",
      columns: [t.formInputId, t.formId, t.formType],
      foreignColumns: [
        formInputsTable.id,
        formInputsTable.formId,
        formInputsTable.formType,
      ],
    }),
    foreignKey({
      name: "field_inputs_field_form_fk",
      columns: [t.fieldId, t.formId],
      foreignColumns: [fieldsTable.id, fieldsTable.simpleFormId],
    }),
  ],
);
