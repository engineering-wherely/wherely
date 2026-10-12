import type { AmplifyDataSchema } from 'lake-pukaki';
import type { Maybe } from 'np-westland/types';

export type ADSForm = AmplifyDataSchema['forms']['type'];
export type ADSComposition = AmplifyDataSchema['form_compositions']['type'];
export type ADSFormInput = AmplifyDataSchema['form_inputs']['type'];
export type ADSField = AmplifyDataSchema['fields']['type'];
export type ADSFieldInput = AmplifyDataSchema['field_inputs']['type'];
export type ADSOccurrence = {
  id: string;
  name: string;
  form: ADSForm;
  slot?: ADSComposition;
  cycle: boolean;
  children?: ADSOccurrence[];
};

export type Page<T> = {
  data: T[];
  nextToken?: Maybe<string>;
  errors?: readonly { message: string }[];
};
