import { InputProps } from '@gear-js/ui';
import styles from './Input.module.scss';

function Input({ error, value, onChange }: InputProps) {
  return (
    <div className={styles.wrapper}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        <span className={styles.label}>Contract Address</span>
        <input className={styles.input} placeholder="0x00" onChange={onChange} value={value} />
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export { Input };
