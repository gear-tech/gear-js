import { UseFormInput } from '@mantine/form/lib/types';

import { FieldName, FormValues, FormValidate } from './types';

const INITIAL_VALUES: FormValues = {
  [FieldName.Amount]: 1,
};

const VALIDATE: FormValidate = {
  [FieldName.Amount]: (value) => (value > 0 ? null : 'The value must be greater than 0'),
};

export const FORM_CONFIG: UseFormInput<FormValues> = {
  validate: VALIDATE,
  initialValues: INITIAL_VALUES,
};
