import React from 'react';
import { Field } from 'formik';
import { MetaField } from './meta-parser';
import styles from './MetaFields.module.scss';

export function MetaFormField({ value }: { value: MetaField }) {
  return (
    <div>
      <label className={styles.label} key={value.name} htmlFor={value.name} data-testid={value.name}>
        {value.label}&nbsp;({value.type})
      </label>
      <Field id={value.name} name={value.name} disabled={value.type === 'Null'} />
    </div>
  );
}
