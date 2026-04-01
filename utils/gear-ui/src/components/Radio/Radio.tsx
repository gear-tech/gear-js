import { clsx } from 'clsx';
import type { ComponentPropsWithRef } from 'react';

import styles from './Radio.module.scss';

type Props = ComponentPropsWithRef<'input'> & {
  label: string;
};

const Radio = ({ label, className, ...attrs }: Props) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');

  return (
    <label className={labelClassName}>
      <input type="radio" className={styles.input} {...attrs} />
      {label}
    </label>
  );
};

export type { Props as RadioProps };
// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { Radio, styles as radioStyles };
