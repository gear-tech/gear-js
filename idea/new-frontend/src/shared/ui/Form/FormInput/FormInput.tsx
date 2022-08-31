import clsx from 'clsx';
import { useField } from 'formik';
import { Input, InputProps } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = InputProps & {
  name: string;
};

const FormInput = (props: Props) => {
  const { name, label, className, ...other } = props;

  const [field, meta] = useField(name);

  const classes = clsx(styles.field, styles.uiField, className);
  const showError = meta.error && meta.touched;

  return (
    <div className={styles.formItem}>
      <Input {...other} {...field} label={label} className={classes} />
      {showError && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormInput };
