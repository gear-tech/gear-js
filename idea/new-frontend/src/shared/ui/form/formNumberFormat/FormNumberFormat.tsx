import { useForm, useField } from 'react-final-form';
import { inputStyles } from '@gear-js/ui';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';

import styles from '../Form.module.scss';

type Props = Omit<NumberFormatProps, 'name' | 'value' | 'onValueChange'> & {
  name: string;
  label?: string;
};

const FormNumberFormat = (props: Props) => {
  const { name, label, className, ...other } = props;

  const { change } = useForm();
  const { input, meta } = useField(name);

  const handleChange = ({ floatValue }: NumberFormatValues) => change(name, floatValue);

  const error = meta.invalid && meta.touched ? meta.error : undefined;

  return (
    <div className={styles.formItem}>
      <label htmlFor={name}>
        <span className={inputStyles.text}>{label}</span>
        <div className={inputStyles.wrapper}>
          <NumberFormat
            {...other}
            name={name}
            value={input.value}
            className={inputStyles.input}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
            onValueChange={handleChange}
          />
        </div>
      </label>
      {error && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormNumberFormat };
