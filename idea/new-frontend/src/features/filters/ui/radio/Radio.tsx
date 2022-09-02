/* eslint-disable react/jsx-props-no-spreading */
import { Field, FieldProps } from 'formik';
import clsx from 'clsx';
import { Radio as UIRadio, RadioProps } from '@gear-js/ui';

import styles from './Radio.module.scss';

type Props = Omit<RadioProps, 'name' | 'onChange'> & {
  name: string;
};

const Radio = ({ name, value, label, className }: Props) => (
  <Field type="radio" name={name} value={value}>
    {({ field }: FieldProps) => <UIRadio label={label} className={clsx(styles.radio, className)} {...field} />}
  </Field>
);

export { Radio };
