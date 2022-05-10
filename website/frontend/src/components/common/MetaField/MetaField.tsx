import clsx from 'clsx';
import { useField } from 'formik';
import { Input, Textarea } from '@gear-js/ui';

import styles from './MetaField.module.scss';

type Props = {
  name: string;
  label: string;
  fieldAs?: 'input' | 'textarea';
  disabled?: boolean;
  className?: string;
};

const MetaField = (props: Props) => {
  const { name, label, fieldAs = 'input', disabled = false, className } = props;

  const [field, meta] = useField(name);

  const FieldComponent = fieldAs === 'input' ? Input : Textarea;

  const showError = meta.error && meta.touched;

  return (
    <div className={styles.item}>
      <FieldComponent {...field} label={label} disabled={disabled} className={clsx(styles.field, className)} />
      {showError && <div className={styles.error}>{meta.error}</div>}
    </div>
  );
};

export { MetaField };
