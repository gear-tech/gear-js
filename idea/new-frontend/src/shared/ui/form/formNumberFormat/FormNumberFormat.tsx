import { useForm, useField } from 'react-final-form';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';
import clsx from 'clsx';
import { InputWrapper, inputStyles, InputProps } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = Omit<NumberFormatProps & InputProps, 'name' | 'value' | 'onValueChange' | 'onChange'> & {
  name: string;
};

const FormNumberFormat = (props: Props) => {
  const { name, label, size = 'normal', color = 'dark', className, ...other } = props;

  const { change } = useForm();
  const { input, meta } = useField(name);

  const handleChange = ({ floatValue }: NumberFormatValues) => change(name, floatValue);

  const error = meta.invalid && meta.touched ? meta.error : undefined;

  const wrapperClassName = clsx(inputStyles.wrapper, inputStyles[size], inputStyles[color], error && inputStyles.error);

  const inputClassName = clsx(inputStyles.input, inputStyles[color]);

  return (
    <InputWrapper id={name} label={label} size={size} error={error} direction="y" className={styles.field}>
      <div className={wrapperClassName}>
        <NumberFormat
          {...other}
          id={name}
          name={name}
          value={input.value}
          className={inputClassName}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          onValueChange={handleChange}
        />
      </div>
    </InputWrapper>
  );
};

export { FormNumberFormat };
