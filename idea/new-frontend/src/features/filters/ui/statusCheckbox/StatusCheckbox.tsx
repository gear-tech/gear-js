import { ChangeEvent } from 'react';
import { useField, useForm } from 'react-final-form';
import { CheckboxProps, checkboxStyles } from '@gear-js/ui';

import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';

import clsx from 'clsx';
import styles from './StatusCheckbox.module.scss';

type Props = Omit<CheckboxProps, 'name' | 'value' | 'onChange'> & {
  name: string;
  value: string;
  status: BulbStatus;
};

const StatusCheckbox = ({ name, label, value, status }: Props) => {
  const { input } = useField(name, { type: 'checkbox', value });
  const { submit } = useForm();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    input.onChange(event);
    submit();
  };

  const inputClasses = clsx(checkboxStyles.input, checkboxStyles.checkbox);

  return (
    <label htmlFor={input.name} className={checkboxStyles.label}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...input} className={inputClasses} onChange={handleChange} />
      <BulbBlock status={status} text={label} className={styles.text} />
    </label>
  );
};

export { StatusCheckbox };
