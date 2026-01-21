import { FieldsetHTMLAttributes } from 'react';

import styles from './fieldset.module.scss';

type Props = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  legend: string;
};

const Fieldset = ({ legend, children, ...props }: Props) => {
  return (
    <fieldset className={styles.fieldset} {...props}>
      {legend && <legend className={styles.legend}>{legend}</legend>}
      {children}
    </fieldset>
  );
};

export { Fieldset };
