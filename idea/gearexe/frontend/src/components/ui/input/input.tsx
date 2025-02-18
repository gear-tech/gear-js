import clsx from 'clsx';
import styles from './input.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

const Input = ({ label, error, ...props }: Props) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={props.name}>
        {label || props.name}:
      </label>
      <div className={styles.errorWrapper}>
        <input className={clsx(styles.input, error && styles.invalid)} {...props} />
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

export { Input };
