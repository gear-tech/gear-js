import { UseFormInput } from '@mantine/form/lib/types';

import { FieldName, FormValues, FormValidate } from './types';

const INITIAL_VALUES: FormValues = {
  [FieldName.Reward]: 0,
  [FieldName.DistributionTime]: '',
};

const VALIDATE: FormValidate = {
  [FieldName.Reward]: (value) => (value > 0 ? null : 'Reward must be more than 0'),
  [FieldName.DistributionTime]: (value: string) => {
    if (!value) return 'Field is required';

    const currentDate = Date.parse(value);

    return currentDate > Date.now() ? null : 'Date must be more than current';
  },
};

export const FORM_CONFIG: UseFormInput<FormValues> = {
  validate: VALIDATE,
  initialValues: INITIAL_VALUES,
};
