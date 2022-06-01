import { FormikHelpers } from 'formik/dist/types';

import { FormPayloadValues } from 'components/common/FormPayload/types';

export type FormValues = {
  value: number;
  gasLimit: number;
  payload: FormPayloadValues;
  payloadType: string;
  destination: string;
};

export type SetFieldValue = FormikHelpers<FormValues>['setFieldValue'];
