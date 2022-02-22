import React, { FC } from 'react';
import { Field, useField } from 'formik';
import clsx from 'clsx';
import styles from './MetaField.module.scss';

type Props = {
  name: string;
  isDisabled: boolean;
};

export const MetaField: FC<Props> = ({ name, isDisabled }) => {
  const [field, meta] = useField(name);
  const isTextarea = ['types'].includes(name);

  return (
    <div className={styles.item}>
      <label htmlFor={name} className={clsx(styles.caption, isTextarea && styles.top)}>
        {name}:
      </label>
      <div className={styles.value}>
        <Field
          {...field}
          id={name}
          name={name}
          className={clsx(styles.field, isTextarea && styles.textarea)}
          as={isTextarea ? 'textarea' : 'input'}
          disabled={isDisabled}
        />
        {meta.error && meta.touched ? <div className={styles.error}>{meta.error}</div> : null}
      </div>
    </div>
  );
};
