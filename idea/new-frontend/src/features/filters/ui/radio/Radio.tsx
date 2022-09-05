import { ChangeEvent } from 'react';
import { useField, useForm } from 'react-final-form';
import clsx from 'clsx';
import { Radio as UIRadio, RadioProps } from '@gear-js/ui';

import styles from './Radio.module.scss';

type Props = Omit<RadioProps, 'name' | 'onChange'> & {
  name: string;
};

const Radio = ({ name, value, label, className }: Props) => {
  const { submit } = useForm();
  const { input } = useField(name, { type: 'radio', value });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    input.onChange(event);
    submit();
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <UIRadio {...input} label={label} className={clsx(styles.radio, className)} onChange={handleChange} />;
};

export { Radio };
