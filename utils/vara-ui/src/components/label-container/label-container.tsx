import { PropsWithChildren, ReactNode } from 'react';
import cx from 'clsx';

import styles from './label-container.module.scss';

type Props = PropsWithChildren & {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  error?: ReactNode;
  block?: boolean;
  className?: string;
};

function LabelContainer({ size = 'medium', label, className, block, children, error }: Props) {
  return (
    <label className={cx(styles.container, styles[size], className, block && styles.block)}>
      {label && <span className={styles.label}>{label}</span>}

      <span className={styles.inputWrapper}>{children}</span>

      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

export { LabelContainer };
export type { Props as LabelContainerProps };
