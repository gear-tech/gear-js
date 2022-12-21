/* eslint-disable func-names */
import * as yup from 'yup';
import { ProgramMetadata, CreateType } from '@gear-js/api';

import { PayloadValue } from 'entities/formPayload';
import { getSubmitPayload } from 'features/formPayload';

const PAYLOAD_ERROR_MESSAGE = 'Invalid payload';
const PAYLOAD_TYPE_ERROR_MESSAGE = 'Invalid payload type';

// TODO: add ts support https://github.com/jquense/yup/issues/312
yup.addMethod(yup.mixed, 'testPayload', function (type?: string, metadata?: ProgramMetadata) {
  return this.test('testPayload', PAYLOAD_ERROR_MESSAGE, function (payload: PayloadValue = '') {
    const { parent, createError } = this;

    if (metadata && !type) {
      return true;
    }

    if (!metadata && !parent.payloadType) {
      return createError({ message: PAYLOAD_TYPE_ERROR_MESSAGE });
    }

    // m
    // metadata?.createType()
    // TODO:
    const payloadType = metadata ? type : parent.payloadType;
    const submitPayload = getSubmitPayload(payload);

    try {
      // CreateType.create(payloadType, submitPayload, metadata);

      return true;
    } catch {
      return false;
    }
  });
});
