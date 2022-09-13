import { useForm, useField } from 'react-final-form';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';
import clsx from 'clsx';
import { InputWrapper, inputStyles, InputProps, Button } from '@gear-js/ui';

import { formStyles } from 'shared/ui/form';
import calculatorSVG from 'shared/assets/images/actions/calculator.svg';

import styles from './GasField.module.scss';

type Props = Omit<NumberFormatProps & InputProps, 'name' | 'value' | 'onValueChange' | 'onChange'> & {
  name: string;
  onGasCalculate: () => void;
};

const GasField = (props: Props) => {
  const { name, label, className, onGasCalculate, ...other } = props;

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
    <InputWrapper id={name} label={label} size="normal" error={error} direction="y" className={formStyles.field}>
      <div className={styles.content}>
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
        <Button icon={calculatorSVG} text="Calculate gas" color="light" onClick={onGasCalculate} />
      </div>
    </InputWrapper>
  );
};

export { GasField };
