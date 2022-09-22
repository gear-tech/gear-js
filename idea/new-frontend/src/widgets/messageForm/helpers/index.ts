import * as yup from 'yup';
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';

import { PayloadSchemaParams, PayloadValue } from 'entities/formPayload';

const getValidationSchema = ({ type, deposit, metadata, maxGasLimit }: PayloadSchemaParams) =>
  yup.object().shape({
    value: yup
      .number()
      .required('This field is required')
      .test('min', `Value should be more ${deposit} or equal than 0`, (value = 0) => value === 0 || value > deposit),
    // @ts-ignore
    payload: yup.mixed().default('').testPayload(type, metadata),
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
