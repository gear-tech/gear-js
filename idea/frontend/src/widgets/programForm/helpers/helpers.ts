import * as yup from 'yup';
import BigNumber from 'bignumber.js';

import { PayloadSchemaParams } from 'entities/formPayload';
import { isDecimal } from 'shared/helpers';

const getValidationSchema = ({
  deposit,
  maxGasLimit,
  decimals,
  balanceMultiplier,
  gasLimitDecimals,
  gasLimitMultiplier,
}: PayloadSchemaParams) =>
  yup.object().shape({
    value: yup
      .string()
      .required('This field is required')
      .test(
        'max',
        `Maximum amount of decimal places is ${decimals}`,
        (value = '0') => !isDecimal(BigNumber(value).multipliedBy(balanceMultiplier).toFixed()),
      )
      .test(
        'min',
        `Minimum value is ${deposit.toFixed()} or 0`,
        (value = '0') => BigNumber(value).isEqualTo(0) || BigNumber(value).isGreaterThanOrEqualTo(deposit),
      ),

    gasLimit: yup
      .string()
      .required('This field is required')
      .test(
        'max',
        `Maximum amount of decimal places is ${gasLimitDecimals}`,
        (value = '0') => !isDecimal(BigNumber(value).multipliedBy(gasLimitMultiplier).toFixed()),
      )
      .test('max', `Gas limit should be less than ${maxGasLimit.toFixed()}`, (value = '0') =>
        BigNumber(value).isLessThanOrEqualTo(maxGasLimit),
      ),

    programName: yup.string().max(50, 'Name value should be less than 50'),
    payloadType: yup.string().required('This field is required'),
  });

export { getValidationSchema };
