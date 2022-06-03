import clsx from 'clsx';
import { useField } from 'formik';
import { Input, InputProps } from '@gear-js/ui';

import styles from '../FormFields.module.scss';

type Props = InputProps & {
  name: string;
};

const FormInput = (props: Props) => {
  const { name, label, className, ...other } = props;

  const [field, meta] = useField(name);

  const showError = meta.error && meta.touched;

  return (
    <div className={styles.item}>
      <Input {...other} {...field} label={label} className={clsx(styles.field, className)} />
      {showError && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormInput };
