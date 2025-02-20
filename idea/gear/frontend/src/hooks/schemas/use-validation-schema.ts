import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
// eslint-disable-next-line import/no-named-as-default -- TODO(#1800): resolve eslint comments
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

function useValidationSchema() {
  const { api, isApiReady } = useApi();
  const { decimals, getFormattedBalanceValue, getFormattedGasValue, getChainGasValue, getChainBalanceValue } =
    useBalanceFormat();

  const deposit = isApiReady ? api.existentialDeposit.toString() : '';
  const maxGasLimit = isApiReady ? api.blockGasLimit.toString() : '';

  const formattedDeposit = getFormattedBalanceValue(deposit);
  const formattedMaxGasLimit = getFormattedGasValue(maxGasLimit);

  const required = yup.string().required('This field is required');

  const value = required
    .test('max', `Maximum amount of decimal places is ${decimals}`, (_value = '0') =>
      getChainBalanceValue(_value).isInteger(),
    )
    .test(
      'min',
      `Minimum value is ${formattedDeposit.toFixed()} or 0`,
      (_value = '0') => BigNumber(_value).isEqualTo(0) || getChainBalanceValue(_value).isGreaterThanOrEqualTo(deposit),
    );

  const gasLimit = required.test(
    'max',
    `Gas limit should be less than ${formattedMaxGasLimit.toFixed()}`,
    (_value = '0') => getChainGasValue(_value).isLessThanOrEqualTo(maxGasLimit),
  );

  const payloadType = required;

  return yup.object().shape({ value, gasLimit, payloadType });
}

export { useValidationSchema };
