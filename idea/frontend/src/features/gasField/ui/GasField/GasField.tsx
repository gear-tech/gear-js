import { useForm, useField } from 'react-final-form';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';
import clsx from 'clsx';
import { InputWrapper, inputStyles, InputProps, Button } from '@gear-js/ui';

import { formStyles } from 'shared/ui/form';
import calculatorSVG from 'shared/assets/images/actions/calculator.svg';
import { Result } from 'hooks/useGasCalculate/types';

import { Info } from '../Info';
import styles from './GasField.module.scss';

type Props = Omit<NumberFormatProps & InputProps, 'value' | 'onValueChange' | 'onChange'> & {
  info: Result | undefined;
  onGasCalculate: () => void;
  block?: boolean;
};

const GasField = (props: Props) => {
  const { label, disabled, className, onGasCalculate, direction = 'x', gap, block, info, ...other } = props;
  const name = 'gasLimit';

  const { change } = useForm();
  const { input, meta } = useField(name);

  const handleChange = ({ floatValue }: NumberFormatValues) => change(name, floatValue);

  const increaseByTenPercent = () => {
    const currentValue = +input.value;
    const increasedValue = currentValue + Math.round(currentValue / 10);

    change(name, increasedValue);
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
            </div>
            <button type="button" className={styles.addButton} onClick={increaseByTenPercent}>
              +10%
            </button>
          </div>
          <Button
            icon={calculatorSVG}
            text="Calculate gas"
            color="light"
            disabled={disabled}
            onClick={onGasCalculate}
          />
        </div>
        {info && <Info isAwait={info.waited} reserved={info.reserved} returned={info.mayBeReturned} />}
      </div>
    </InputWrapper>
  );
};

export { GasField };
