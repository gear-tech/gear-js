import { HTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from './Fieldset.module.scss';

type Props = HTMLAttributes<HTMLFieldSetElement> & {
  legend?: string;
};

const Fieldset = ({ legend, className, children, ...props }: Props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <fieldset className={clsx(styles.fieldset, className)} {...props}>
    {legend && <legend className={styles.legend}>{legend}</legend>}
    {children}
  </fieldset>
);

export { Fieldset };
