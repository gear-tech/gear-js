import { isHex } from '@polkadot/util';
import { UseFormInput } from '@mantine/form/lib/types';

import { FieldName, FormValues, FormValidate } from './types';

const INITIAL_VALUES: FormValues = {
  [FieldName.Reward]: 0,
  [FieldName.RewardAddress]: '',
  [FieldName.StakingAddress]: '',
  [FieldName.DistributionTime]: '',
};

const VALIDATE: FormValidate = {
  [FieldName.Reward]: (value) => (value ? null : 'Field is required'),
  [FieldName.RewardAddress]: (value: string) => {
    if (!value) return 'Field is required';

    return isHex(value) ? null : 'Address should be hex';
  },
  [FieldName.StakingAddress]: (value: string) => {
    if (!value) return 'Field is required';

    return isHex(value) ? null : 'Address should be hex';
  },
  [FieldName.DistributionTime]: (value: string) => {
    if (!value) return 'Field is required';

    const currentDate = Date.parse(value);

    return currentDate > Date.now() ? null : 'Date must be greater than current';
  },
};

export const FORM_CONFIG: UseFormInput<FormValues> = {
  validate: VALIDATE,
  initialValues: INITIAL_VALUES,
};
