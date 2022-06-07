import clsx from 'clsx';
import { useField } from 'formik';
import { Textarea, TextareaProps } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = TextareaProps & {
  name: string;
};

const FormTextarea = (props: Props) => {
  const { name, label, className, ...other } = props;

  const [field, meta] = useField(name);

  const classes = clsx(styles.field, styles.uiField, className);
  const showError = meta.error && meta.touched;

  return (
    <div className={styles.formItem}>
      <Textarea {...other} {...field} label={label} className={classes} />
      {showError && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { FormTextarea };
