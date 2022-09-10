import clsx from 'clsx';
import { inputStyles } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = {
  text: string;
  label: string;
  isTextarea?: boolean;
};

const FormText = ({ text, label, isTextarea = false }: Props) => {
  const labelClass = isTextarea ? styles.topPadding : styles.center;

  return (
    <div className={clsx(styles.formItem, styles.field)}>
      <span className={clsx(styles.fieldLabel, labelClass)}>{label}</span>
      <div className={clsx(inputStyles.wrapper, inputStyles.readOnly, isTextarea && styles.textarea)}>
        <pre className={styles.text}>{text}</pre>
      </div>
    </div>
  );
};

export { FormText };
