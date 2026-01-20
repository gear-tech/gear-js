import { InputHTMLAttributes } from 'react';

import styles from './checkbox.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox = ({ label, ...props }: Props) => {
  return (
    <label className={styles.container}>
      <input type="checkbox" className={styles.input} {...props} />
      <span className={styles.box} />
      {label && <span>{label}</span>}
    </label>
  );
};

export { Checkbox };
