import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { isDecimal } from '@/shared/helpers';

function useValidationSchema() {
  const { api, isApiReady } = useApi();
  const { decimals, balanceMultiplier, gasMultiplier, getFormattedBalanceValue, getFormattedGasValue } =
    useBalanceFormat();

  const deposit = isApiReady ? api.existentialDeposit.toString() : '';
  const maxGasLimit = isApiReady ? api.blockGasLimit.toString() : '';

  const formattedDeposit = getFormattedBalanceValue(deposit);
  const formattedMaxGasLimit = getFormattedGasValue(maxGasLimit);

  const required = yup.string().required('This field is required');

  const value = required
    .test(
      'max',
      `Maximum amount of decimal places is ${decimals}`,
      (_value = '0') => !isDecimal(BigNumber(_value).multipliedBy(balanceMultiplier).toFixed()),
    )
    .test(
      'min',
      `Minimum value is ${formattedDeposit.toFixed()} or 0`,
      (_value = '0') => BigNumber(_value).isEqualTo(0) || BigNumber(_value).isGreaterThanOrEqualTo(formattedDeposit),
    );

  const gasLimit = required
    .test(
      'max',
      `Exceeded maximum amount of decimal places`,
      (_value = '0') => !isDecimal(BigNumber(_value).multipliedBy(gasMultiplier).toFixed()),
    )
    .test('max', `Gas limit should be less than ${formattedMaxGasLimit.toFixed()}`, (_value = '0') =>
      BigNumber(_value).isLessThanOrEqualTo(formattedMaxGasLimit),
    );

  const payloadType = required;

  return yup.object().shape({ value, gasLimit, payloadType });
}

export { useValidationSchema };
