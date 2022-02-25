import React, { FC } from 'react';
import { MetaField } from './MetaField/MetaField';
import styles from './MetaFields.module.scss';

type Props = {
  fields: string[] | null;
  isDisabled: boolean;
};

export const MetaFields: FC<Props> = ({ fields, isDisabled }) => {
  return fields ? (
    <>
      {fields.map((field: string) => {
        return <MetaField key={field} name={field} isDisabled={isDisabled} />;
      })}
    </>
  ) : (
    <p className={styles.error}>Please, upload a metafile!</p>
  );
};
