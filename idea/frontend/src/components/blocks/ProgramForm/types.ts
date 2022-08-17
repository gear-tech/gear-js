import { Metadata } from '@gear-js/api';
import { FormikHelpers } from 'formik/dist/types';

import { PayloadValue } from 'components/common/Form/FormPayload/types';

export type FormValues = {
  value: number;
  payload: PayloadValue;
  gasLimit: number;
  programName: string;
  payloadType: string;
};

export type SetValues = FormikHelpers<FormValues>['setValues'];
export type SetFieldValue = FormikHelpers<FormValues>['setFieldValue'];

export type PropsToRenderButtons = {
  values: FormValues;
  metadata?: Metadata;
  isDisabled: boolean;
  setFieldValue: SetFieldValue;
};
