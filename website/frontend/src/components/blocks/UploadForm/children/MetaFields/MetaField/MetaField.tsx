import React, { FC } from 'react';
import { Field } from 'formik';
import clsx from 'clsx';
import styles from './MetaField.module.scss';

type Props = {
  field: string;
  isDisabled: boolean;
  errors: any;
  touched: any;
};

export const MetaField: FC<Props> = ({ field, isDisabled, errors, touched }) => {
  const isTextarea = ['types'].includes(field);

  return (
    <div className={styles.item}>
      <label htmlFor={field} className={clsx(styles.caption, isTextarea && styles.top)}>
        {field}:
      </label>
      <div className={styles.value}>
        <Field
          id={field}
          name={field}
          className={clsx(styles.field, isTextarea && styles.textarea)}
          as={isTextarea ? 'textarea' : 'input'}
          disabled={isDisabled}
        />
        {errors[field] && touched[field] ? <div className={styles.error}>{errors[field]}</div> : null}
      </div>
    </div>
  );
};
