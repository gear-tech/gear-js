import { FormikHelpers } from 'formik/dist/types';
import { Metadata } from '@gear-js/api';

import { ParsedTypeStructure } from 'components/common/FormPayload/types';

export type ProgramValues = {
  value: number;
  payload: ParsedTypeStructure;
  gasLimit: number;
  programName: string;
};

export type FormValues = {
  metaValues: Metadata;
  programValues: ProgramValues;
};

export type SetValues = FormikHelpers<FormValues>['setValues'];
export type SetFieldValue = FormikHelpers<FormValues>['setFieldValue'];
