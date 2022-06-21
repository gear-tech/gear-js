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
