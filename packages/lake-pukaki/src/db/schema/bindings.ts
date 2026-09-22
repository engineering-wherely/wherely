import { makeForeignId, makeId } from "@/db/column-helpers";
import {
  bigint,
  foreignKey,
  pgEnum,
  snakeCase,
  unique,
} from "drizzle-orm/pg-core";
import { formInputsTable, formsTable, formType } from "./forms";

export const formSubjectTypeEnum = pgEnum("form_subject_type", [
  "geo_layer",
  "geo_feature",
]);

export const formBindings = snakeCase.table(
  "form_bindings",
  {
    id: makeId(),
    formSubjectType: formSubjectTypeEnum().notNull(),
    formSubjectId: bigint({ mode: "number" }),
    formType: formType().notNull(),
    formId: bigint({ mode: "number" }).notNull(),
  },
  (t) => [
    unique()
      .on(t.formSubjectType, t.formSubjectId, t.formType, t.formId)
      .nullsNotDistinct(),
    unique().on(t.id, t.formId, t.formType),
    foreignKey({
      columns: [t.formId, t.formType],
      foreignColumns: [formsTable.id, formsTable.type],
    }),
  ],
);

export const formInputBindings = snakeCase.table(
  "form_input_bindings",
  {
    id: makeId(),
    formBindingId: makeForeignId(formBindings.id).notNull(),
    formSubjectId: bigint({ mode: "number" }),
    formInputId: makeForeignId(formInputsTable.id).notNull(),
    formId: bigint({ mode: "number" }).notNull(),
    formType: formType().notNull(),
  },
  (t) => [
    unique()
      .on(t.formBindingId, t.formSubjectId, t.formInputId)
      .nullsNotDistinct(),
    foreignKey({
      name: "form_input_bindings_binding_form_fk",
      columns: [t.formBindingId, t.formId, t.formType],
      foreignColumns: [
        formBindings.id,
        formBindings.formId,
        formBindings.formType,
      ],
    }),
    foreignKey({
      name: "form_input_bindings_input_form_fk",
      columns: [t.formInputId, t.formId, t.formType],
      foreignColumns: [
        formInputsTable.id,
        formInputsTable.formId,
        formInputsTable.formType,
      ],
    }),
  ],
);
