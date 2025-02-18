import clsx from 'clsx';
import { HTMLAttributes } from 'react';

import styles from './fieldset.module.scss';

type Props = HTMLAttributes<HTMLFieldSetElement> & {
  legend?: string;
};

const Fieldset = ({ legend, className, children, ...props }: Props) => (
  <fieldset className={clsx(styles.fieldset, className)} {...props}>
    {legend && <legend className={styles.legend}>{legend}</legend>}
    {children}
  </fieldset>
);

export { Fieldset };
