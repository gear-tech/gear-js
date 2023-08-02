import * as yup from 'yup';
import BigNumber from 'bignumber.js';

import { PayloadSchemaParams } from 'entities/formPayload';

const getValidationSchema = ({ deposit, maxGasLimit }: PayloadSchemaParams) =>
  yup.object().shape({
    value: yup
      .string()
      .required('This field is required')
      .test(
        'min',
        `Minimum value is ${deposit.toFixed()} or 0`,
        (value = '0') => BigNumber(value).isEqualTo(0) || BigNumber(value).isGreaterThanOrEqualTo(deposit),
      ),

    gasLimit: yup
      .string()
      .required('This field is required')
      .test('max', `Gas limit should be less than ${maxGasLimit.toFixed()}`, (value = '0') =>
        BigNumber(value).isLessThanOrEqualTo(maxGasLimit),
      ),

    programName: yup.string().max(50, 'Name value should be less than 50'),
    payloadType: yup.string().required('This field is required'),
  });

export { getValidationSchema };
