import { inputStyles, InputProps, InputWrapper } from '@gear-js/ui';
import clsx from 'clsx';
import { useFormContext, useWatch } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { BalanceUnit } from '../balance-unit';

type Props = Omit<NumericFormatProps & InputProps, 'value' | 'onValueChange' | 'onChange'> & {
  name: string;
};

// TODO: same input as a gas field
const ValueField = ({ name, label, direction = 'x', gap, block, ...other }: Props) => {
  const { setValue, getFieldState, formState } = useFormContext();
  const inputValue = useWatch({ name });

  const { error } = getFieldState(name, formState);

  const wrapperClassName = clsx(
    inputStyles.wrapper,
    inputStyles.normal,
    inputStyles.dark,
    error && inputStyles.error,
    block && inputStyles.block,
  );

  return (
    <InputWrapper id={name} label={label} size="normal" error={error?.message} direction={direction} gap={gap}>
      <div className={wrapperClassName} data-testid="wrapper">
        <NumericFormat
          {...other}
          id={name}
          name={name}
          className={clsx(inputStyles.input, inputStyles.dark)}
          allowNegative={false}
          value={inputValue}
          onValueChange={({ value }) => setValue(name, value, { shouldValidate: true })}
          thousandSeparator
        />

        <BalanceUnit />
      </div>
    </InputWrapper>
  );
};

export { ValueField };
