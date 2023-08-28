import { inputStyles, InputProps, InputWrapper } from '@gear-js/ui';
import { useField, useForm } from 'react-final-form';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';
import clsx from 'clsx';

import { BalanceUnit } from '../balance-unit';

type Props = Omit<NumberFormatProps & InputProps, 'value' | 'onValueChange' | 'onChange'> & {
  name: string;
};

// TODO: same input as a gas field
const ValueField = ({ name, label, direction = 'x', gap, block, ...other }: Props) => {
  const { change } = useForm();
  const { input, meta } = useField(name);

  const handleChange = ({ value }: NumberFormatValues) => change(name, value);

  const error = meta.invalid && meta.touched ? meta.error : undefined;

  const wrapperClassName = clsx(
    inputStyles.wrapper,
    inputStyles.normal,
    inputStyles.dark,
    error && inputStyles.error,
    block && inputStyles.block,
  );

  return (
    <InputWrapper id={name} label={label} size="normal" error={error} direction={direction} gap={gap}>
      <div className={wrapperClassName} data-testid="wrapper">
        <NumberFormat
          {...other}
          id={name}
          name={name}
          value={input.value}
          className={clsx(inputStyles.input, inputStyles.dark)}
          allowNegative={false}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          onValueChange={handleChange}
          thousandSeparator
        />

        <BalanceUnit />
      </div>
    </InputWrapper>
  );
};

export { ValueField };
