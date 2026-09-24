import { fieldInputsTable, formInputsTable } from "@/db/schema/forms";
import { createSelectSchema } from "drizzle-orm/zod";
import * as z from "zod";

export const formInputsSelectSchema = createSelectSchema(formInputsTable, {
  parentFormType: z.enum(["composite_form"]),
});
export type FormInput = z.infer<typeof formInputsSelectSchema>;

export const fieldInputsSelectSchema = createSelectSchema(fieldInputsTable, {
  formType: z.enum(["simple_form"]),
});
export type FieldInput = z.infer<typeof fieldInputsSelectSchema>;

export type FormInputNode = FormInput & {
  fieldInputs: FieldInput[];
  children: FormInputNode[];
};
