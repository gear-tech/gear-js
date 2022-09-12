import { Metadata } from '@gear-js/api';

import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  value: number;
  payload: PayloadValue;
  gasLimit: number;
  programName: string;
  payloadType: string;
};

type PropsToRenderButtons = {
  values: FormValues;
  metadata?: Metadata;
  isDisabled: boolean;
};

type Helpers = {
  resetForm: () => void;
  finishSubmitting: () => void;
};

export type { FormValues, PropsToRenderButtons, Helpers };
