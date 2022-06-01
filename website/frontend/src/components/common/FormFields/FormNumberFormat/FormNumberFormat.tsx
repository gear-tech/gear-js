import clsx from 'clsx';
import { useField } from 'formik';
import { inputStyles } from '@gear-js/ui';
import NumberFormat, { NumberFormatProps, NumberFormatValues } from 'react-number-format';

import styles from '../FormFields.module.scss';

type Props = Omit<NumberFormatProps, 'name' | 'value' | 'onValueChange'> & {
  name: string;
  label?: string;
};

const FormNumberFormat = (props: Props) => {
  const { name, label, className, ...other } = props;

  const [field, meta, helpers] = useField(name);

  const handleChange = ({ floatValue }: NumberFormatValues) => helpers.setValue(floatValue);

  const showError = meta.error && meta.touched;

  return (
    <div className={styles.item}>
      <label className={clsx(inputStyles.label, styles.field, className)}>
        <span className={inputStyles.text}>{label}</span>
        <div className={inputStyles.wrapper}>
          <NumberFormat
            name={field.name}
            value={field.value}
            onValueChange={handleChange}
            className={inputStyles.input}
            {...other}
          />
        </div>
      </label>
      {showError && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormNumberFormat };
