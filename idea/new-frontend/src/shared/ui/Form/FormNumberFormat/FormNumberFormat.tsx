import clsx from 'clsx';
import { useField } from 'formik';
import { inputStyles } from '@gear-js/ui';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';

import styles from '../Form.module.scss';

type Props = Omit<NumberFormatProps, 'name' | 'value' | 'onValueChange'> & {
  name: string;
  label?: string;
};

const FormNumberFormat = (props: Props) => {
  const { name, label, className, ...other } = props;

  const [field, meta, helpers] = useField(name);

  const handleChange = ({ floatValue }: NumberFormatValues) => helpers.setValue(floatValue);

  const classes = clsx(inputStyles.label, styles.field, styles.uiField, className);
  const showError = meta.error && meta.touched;

  return (
    <div className={styles.formItem}>
      <label htmlFor={field.name} className={classes}>
        <span className={inputStyles.text}>{label}</span>
        <div className={inputStyles.wrapper}>
          <NumberFormat
            {...other}
            name={field.name}
            value={field.value}
            className={inputStyles.input}
            onBlur={field.onBlur}
            onValueChange={handleChange}
          />
        </div>
      </label>
      {showError && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormNumberFormat };
