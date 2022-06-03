import { FormikHelpers } from 'formik/dist/types';

import { PayloadValue } from 'components/common/FormPayload/types';

export type FormValues = {
  value: number;
  gasLimit: number;
  payload: PayloadValue;
  payloadType: string;
  destination: string;
};

export type SetFieldValue = FormikHelpers<FormValues>['setFieldValue'];
