import React from 'react';
import { Field } from 'formik';
import { MetaField as TMetaField } from './meta-parser';
import styles from './MetaFields.module.scss';

export function MetaField({ value }: { value: TMetaField }) {
  return (
    <div>
      <label className={styles.label} key={value.name} htmlFor={value.name} data-testid={value.name}>
        {value.label}&nbsp;({value.type})
      </label>
      <Field id={value.name} name={value.name} disabled={value.type === 'Null'} />
    </div>
  );
}
