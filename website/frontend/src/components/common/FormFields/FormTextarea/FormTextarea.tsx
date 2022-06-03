import clsx from 'clsx';
import { useField } from 'formik';
import { Textarea, TextareaProps } from '@gear-js/ui';

import styles from '../FormFields.module.scss';

type Props = TextareaProps & {
  name: string;
};

const FormTextarea = (props: Props) => {
  const { name, label, className, ...other } = props;

  const [field, meta] = useField(name);

  const showError = meta.error && meta.touched;

  return (
    <div className={styles.item}>
      <Textarea {...other} {...field} label={label} className={clsx(styles.field, className)} />
      {showError && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormTextarea };
