import React, { FC } from 'react';
import { MetaField } from './MetaField/MetaField';
import styles from './MetaFields.module.scss';

type Props = {
  fields: any;
  isDisabled: boolean;
  errors: any;
  touched: any;
};

export const MetaFields: FC<Props> = ({ fields, isDisabled, errors, touched }) =>
  fields ? (
    fields.map((field: any) => {
      return <MetaField field={field} isDisabled={isDisabled} errors={errors} touched={touched} />;
    })
  ) : (
    <p className={styles.error}>Please, upload a metafile!</p>
  );
