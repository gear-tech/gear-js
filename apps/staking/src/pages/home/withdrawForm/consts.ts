import { UseFormInput } from '@mantine/form/lib/types';

import { FieldName, FormValues, FormValidate } from './types';

const INITIAL_VALUES: FormValues = {
  [FieldName.Amount]: '',
};

const VALIDATE: FormValidate = {
  [FieldName.Amount]: (value) => (value ? null : 'Field is required'),
};

export const FORM_CONFIG: UseFormInput<FormValues> = {
  validate: VALIDATE,
  initialValues: INITIAL_VALUES,
  validateInputOnChange: true,
};
