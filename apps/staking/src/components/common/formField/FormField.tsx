import { forwardRef, ForwardedRef, ReactNode } from 'react';
import clsx from 'clsx';
import { Input, InputProps } from '@gear-js/ui';

import styles from './FormField.module.scss';

type Props = InputProps & {
  error?: ReactNode;
};

const FormField = forwardRef(({ error, className, ...otherProps }: Props, ref: ForwardedRef<HTMLInputElement>) => (
  <div className={styles.fieldWrapper}>
    <Input ref={ref} className={clsx(styles.field, className)} {...otherProps} />
    {error && <p className={styles.fieldError}>{error}</p>}
  </div>
));

export { FormField };
