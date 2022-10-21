// TODO: remove after repo @types/react resolution drop
// @ts-ignore
import { ChangeEvent, useId } from 'react';
import { useField, useForm } from 'react-final-form';
import clsx from 'clsx';
import { CheckboxProps, checkboxStyles } from '@gear-js/ui';

import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';

import styles from './StatusCheckbox.module.scss';

type Props = Omit<CheckboxProps, 'name' | 'value' | 'onChange'> & {
  name: string;
  value: string;
  status: BulbStatus;
};

const StatusCheckbox = ({ name, label, value, status }: Props) => {
  const { input } = useField(name, { type: 'checkbox', value });
  const { submit } = useForm();

  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    input.onChange(event);
    submit();
  };

  const inputClasses = clsx(checkboxStyles.input, checkboxStyles.checkbox);

  return (
    <label htmlFor={id} className={checkboxStyles.label}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...input} id={id} className={inputClasses} onChange={handleChange} />
      <BulbBlock size="large" color="primary" status={status} text={label} className={styles.status} />
    </label>
  );
};

export { StatusCheckbox };
