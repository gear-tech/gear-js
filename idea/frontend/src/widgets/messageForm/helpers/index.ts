import * as yup from 'yup';
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';

import { PayloadSchemaParams, PayloadValue } from 'entities/formPayload';
import BigNumber from 'bignumber.js';

const getValidationSchema = ({ deposit, maxGasLimit }: PayloadSchemaParams) =>
  yup.object().shape({
    value: yup
      .string()
      .required('This field is required')
      .test(
        'min',
        `Minimum value is ${deposit.toString()} or 0`,
        (value = '0') => BigNumber(value).isEqualTo(0) || BigNumber(value).isGreaterThanOrEqualTo(deposit),
      ),

    gasLimit: yup
      .number()
      .required('This field is required')
      .min(0, 'Gas limit should be more or equal than 0')
      .max(maxGasLimit, `Gas limit should be less than ${maxGasLimit}`),
    payloadType: yup.string().required('This field is required'),
  });

const resetPayloadValue = (payload: PayloadValue): PayloadValue => {
  if (isString(payload)) {
    return '';
  }

  if (Array.isArray(payload)) {
    return payload.map(resetPayloadValue);
  }

  if (isPlainObject(payload)) {
    const preparedValues = Object.entries(payload!).map((item) => [item[0], resetPayloadValue(item[1])]);

    return Object.fromEntries(preparedValues);
  }

  return payload;
};

export { getValidationSchema, resetPayloadValue };
