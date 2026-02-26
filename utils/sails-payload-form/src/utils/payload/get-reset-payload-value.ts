import { PayloadValue } from '../../types';

const getValue = (value: PayloadValue): PayloadValue => {
  if (typeof value === 'string') return '';
  if (typeof value === 'boolean') return false;
  if (Array.isArray(value)) return value.map((_value) => getValue(_value));

  if (typeof value === 'object' && value !== null)
    return Object.fromEntries(Object.entries(value).map(([key, _value]) => [key, getValue(_value)] as const));

  return value;
};

// hacky assertion due to migration to latest react-hook-form.
// it's payload value is inferred as Record<string, unknown> probably cuz of recursive PayloadValue nature.
// TODO: figure out a healthy way to type payload values for flawless useForm inference
const getResetPayloadValue = (value: Record<string, unknown>) => {
  return getValue(value as PayloadValue) as Record<string, unknown>;
};

export { getResetPayloadValue };
