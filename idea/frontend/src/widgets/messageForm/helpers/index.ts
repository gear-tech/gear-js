import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';

import { PayloadValue } from '@/entities/formPayload';

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

export { resetPayloadValue };
