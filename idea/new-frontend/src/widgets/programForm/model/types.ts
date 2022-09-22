import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  value: number;
  payload: PayloadValue;
  gasLimit: number;
  programName: string;
  payloadType: string;
};

type RenderButtonsProps = {
  isDisabled: boolean;
};

type SubmitHelpers = {
  enableButtons: () => void;
};

export type { FormValues, SubmitHelpers, RenderButtonsProps };
