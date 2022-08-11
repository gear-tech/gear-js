import { Input as GearInput, InputProps } from '@gear-js/ui';
import { ReactNode } from 'react';
import styles from './Input.module.scss';

type Props = InputProps & {
  inputClassName?: string;
  error?: ReactNode;
};

function Input({ className, inputClassName, error, ...props }: Props) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <GearInput className={inputClassName} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export { Input };
