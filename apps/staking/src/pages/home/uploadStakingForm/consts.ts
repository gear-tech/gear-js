import { isHex } from '@polkadot/util';
import { UseFormInput } from '@mantine/form/lib/types';

import { FieldName, FormValues, FormValidate } from './types';

const INITIAL_VALUES: FormValues = {
  [FieldName.Reward]: '',
  [FieldName.Interval]: 0,
  [FieldName.RewardAddress]: '',
  [FieldName.StakingAddress]: '',
};

const VALIDATE: FormValidate = {
  [FieldName.Reward]: (value) => (value ? null : 'Field is required'),
  [FieldName.Interval]: (value) => {
    if (value < 0) return "Interval can't be negative";
    if (value === 0) return "Interval can't be 0";

    return null;
  },
  [FieldName.RewardAddress]: (value) => (isHex(value) ? null : 'Address should be hex'),
  [FieldName.StakingAddress]: (value) => (isHex(value) ? null : 'Address should be hex'),
};

export const FORM_CONFIG: UseFormInput<FormValues> = {
  validate: VALIDATE,
  initialValues: INITIAL_VALUES,
  validateInputOnChange: true,
};
