import { FieldName, FormValues, FormValidate } from './types';

const INITIAL_VALUES: FormValues = {
  [FieldName.Amount]: 0,
};

const VALIDATE: FormValidate = {
  [FieldName.Amount]: (value) => (value > 0 ? null : 'The value must be greater than 0'),
};

export const FORM_CONFIG = {
  validate: VALIDATE,
  initialValues: INITIAL_VALUES,
};
