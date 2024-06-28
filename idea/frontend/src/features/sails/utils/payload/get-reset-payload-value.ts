import { isString } from '@/shared/helpers';

import { PayloadValue } from '../../types';

const getResetPayloadValue = (value: PayloadValue): PayloadValue => {
  if (isString(value)) return '';
  if (Array.isArray(value)) return value.map((_value) => getResetPayloadValue(_value));

  if (typeof value === 'object' && value !== null)
    return Object.fromEntries(
      Object.entries(value).map(([key, _value]) => [key, getResetPayloadValue(_value)] as const),
    );

  return value;
};

export { getResetPayloadValue };
