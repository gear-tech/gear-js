import { InputHTMLAttributes, ReactNode, forwardRef, FunctionComponent, SVGProps } from 'react';
import cx from 'clsx';

import styles from './input.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'size'> & {
  icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  error?: ReactNode;
  block?: boolean;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ icon: Icon, className, label, error, type = 'text', size = 'medium', block, ...attrs }, ref) => {
    return (
      <label className={cx(styles.container, styles[size], className, block && styles.block)}>
        {label && <span className={styles.label}>{label}</span>}

        <span className={styles.inputWrapper}>
          {Icon && <Icon className={styles.icon} />}

          <input className={styles.input} type={type} ref={ref} aria-invalid={Boolean(error)} {...attrs} />
        </span>

        {error && <span className={styles.error}>{error}</span>}
      </label>
    );
  },
);

export { Input };
export type { Props as InputProps };
