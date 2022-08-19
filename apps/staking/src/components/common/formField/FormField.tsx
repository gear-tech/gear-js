import { ReactNode, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Input, InputProps } from '@gear-js/ui';

import styles from './FormField.module.scss';

type Props = InputProps & {
  error?: ReactNode;
  isFocused?: boolean;
};

function FormField({ error, className, isFocused = false, ...otherProps }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <div className={styles.fieldWrapper}>
      <Input ref={inputRef} className={clsx(styles.field, className)} {...otherProps} />
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

export { FormField };
