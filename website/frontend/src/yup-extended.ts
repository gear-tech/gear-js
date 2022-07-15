/* eslint-disable func-names */
import * as yup from 'yup';
import { Metadata, CreateType } from '@gear-js/api';

import { PayloadValue } from 'components/common/Form/FormPayload/types';
import { getSubmitPayload } from 'components/common/Form/FormPayload/helpers';

const PAYLOAD_ERROR_MESSAGE = 'Invalid payload';
const PAYLOAD_TYPE_ERROR_MESSAGE = 'Invalid payload type';

// TODO: add ts support https://github.com/jquense/yup/issues/312
yup.addMethod(yup.mixed, 'testPayload', function (type?: string, metadata?: Metadata) {
  return this.test('testPayload', PAYLOAD_ERROR_MESSAGE, function (payload: PayloadValue = '') {
    const { parent, createError } = this;

    if (metadata && !type) {
      return true;
    }

    if (!metadata && !parent.payloadType) {
      return createError({ message: PAYLOAD_TYPE_ERROR_MESSAGE });
    }

    const payloadType = metadata ? type : parent.payloadType;
    const submitPayload = getSubmitPayload(payload);

    try {
      CreateType.create(payloadType, submitPayload, metadata);

      return true;
    } catch {
      return false;
    }
  });
});
