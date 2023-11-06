import { InputWrapper, inputStyles, InputProps, Button } from '@gear-js/ui';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { useFormContext, useWatch } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { formStyles } from '@/shared/ui/form';
import calculatorSVG from '@/shared/assets/images/actions/calculator.svg?react';
import { Result } from '@/hooks/useGasCalculate/types';
import { BalanceUnit } from '@/shared/ui/form/balance-unit';
import { useGasMultiplier } from '@/hooks';

import { Info } from '../Info';
import styles from './GasField.module.scss';

type Props = Omit<NumericFormatProps & InputProps, 'value' | 'onValueChange' | 'onChange'> & {
  info: Result | undefined;
  onGasCalculate: () => void;
};

const GasField = (props: Props) => {
  const { gasDecimals } = useGasMultiplier();

  const { disabled, onGasCalculate, direction = 'x', gap, block, info, ...other } = props;
  const name = 'gasLimit';

  const { setValue, getFieldState, formState } = useFormContext();
  const inputValue = useWatch({ name });
  const { error } = getFieldState(name, formState);

  const increaseByTenPercent = () => {
    const bnValue = BigNumber(inputValue);

    const bnMultiplier = bnValue.multipliedBy(0.1);
    const increasedValue = bnValue.plus(bnMultiplier);

    setValue(name, increasedValue.toFixed(gasDecimals), { shouldValidate: true });
  };

  const inputClassName = clsx(inputStyles.input, inputStyles.dark, styles.field);

  return (
    <InputWrapper
      id={name}
      label="Gas limit"
      size="normal"
      error={error?.message}
      direction={direction}
      gap={gap}
      className={formStyles.field}>
      <div className={clsx(styles.content, block && styles.block)}>
        <div className={styles.input}>
          <div className={clsx(styles.wrapper, error && styles.error)}>
            <div className={styles.inputWrapper}>
              <NumericFormat
                {...other}
                id={name}
                name={name}
                className={inputClassName}
                allowNegative={false}
                thousandSeparator
                value={inputValue}
                onValueChange={({ value }) => setValue(name, value, { shouldValidate: true })}
              />

              <BalanceUnit />
            </div>

            <Button text="+ 10%" color="light" className={styles.addButton} onClick={increaseByTenPercent} />
          </div>

          <Button icon={calculatorSVG} text="Calculate" color="light" disabled={disabled} onClick={onGasCalculate} />
        </div>

        {info && <Info isAwait={info.waited} reserved={info.reserved} returned={info.mayBeReturned} />}
      </div>
    </InputWrapper>
  );
};

export { GasField };
