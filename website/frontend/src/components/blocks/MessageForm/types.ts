import { FormikHelpers } from 'formik/dist/types';

import { PayloadValue } from 'components/common/Form/FormPayload/types';

export type FormValues = {
  value: number;
  gasLimit: number;
  payload: PayloadValue;
  payloadType: string;
};

export type RenderButtonsProps = {
  isDisabled: boolean;
  calculateGas: () => void;
};

export type SetFieldValue = FormikHelpers<FormValues>['setFieldValue'];
