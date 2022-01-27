import React, { FC } from 'react';
import { MetaField } from './MetaField/MetaField';

type Props = {
  fields: any;
  isDisabled: boolean;
  errors: any;
  touched: any;
};

export const MetaFields: FC<Props> = ({ fields, isDisabled, errors, touched }) =>
  fields.map((field: any) => {
    return <MetaField field={field} isDisabled={isDisabled} errors={errors} touched={touched} />;
  });
