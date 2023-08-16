import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  value: string;
  payload: PayloadValue;
  gasLimit: string;
  programName: string;
  payloadType: string;
};

type RenderButtonsProps = {
  isDisabled: boolean;
};

type SubmitHelpers = {
  enableButtons: () => void;
  resetForm: () => void;
};

export type { FormValues, SubmitHelpers, RenderButtonsProps };
