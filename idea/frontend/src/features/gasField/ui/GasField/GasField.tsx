import { InputWrapper, inputStyles, InputProps, Button } from '@gear-js/ui';
import { useForm, useField } from 'react-final-form';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';

import { formStyles } from 'shared/ui/form';
import { ReactComponent as calculatorSVG } from 'shared/assets/images/actions/calculator.svg';
import { Result } from 'hooks/useGasCalculate/types';
import { BalanceUnit } from 'shared/ui/form/balance-unit';

import { Info } from '../Info';
import styles from './GasField.module.scss';

type Props = Omit<NumberFormatProps & InputProps, 'value' | 'onValueChange' | 'onChange'> & {
  info: Result | undefined;
  onGasCalculate: () => void;
};

const GasField = (props: Props) => {
  const { label, disabled, className, onGasCalculate, direction = 'x', gap, block, info, ...other } = props;
  const name = 'gasLimit';

  const { change } = useForm();
  const { input, meta } = useField(name);

  const handleChange = ({ value }: NumberFormatValues) => change(name, value);

  const increaseByTenPercent = () => {
    const bnValue = BigNumber(input.value);

    const bnMultiplier = bnValue.multipliedBy(0.1);
    const increasedValue = bnValue.plus(bnMultiplier);

    change(name, increasedValue.toFixed(9));
  };

  const error = meta.invalid && meta.touched ? meta.error : undefined;
  const inputClassName = clsx(inputStyles.input, inputStyles.dark, styles.field);

  return (
    <InputWrapper
      id={name}
      label="Gas limit"
      size="normal"
      error={error}
      direction={direction}
      gap={gap}
      className={formStyles.field}>
      <div className={clsx(styles.content, block && styles.block)}>
        <div className={styles.input}>
          <div className={clsx(styles.wrapper, error && styles.error)}>
            <div className={styles.inputWrapper}>
              <NumberFormat
                {...other}
                id={name}
                name={name}
                value={input.value}
                className={inputClassName}
                allowNegative={false}
                thousandSeparator
                onBlur={input.onBlur}
                onFocus={input.onFocus}
                onValueChange={handleChange}
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
