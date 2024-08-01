import { PayloadValue } from '@/entities/formPayload';

type FormValues = {
  value: string;
  payload: PayloadValue;
  gasLimit: string;
  programName: string;
  payloadType: string | undefined;
  keepAlive: boolean;
};

type RenderButtonsProps = {
  isDisabled: boolean;
};

type SubmitHelpers = {
  resetForm: () => void;
};

export type { FormValues, SubmitHelpers, RenderButtonsProps };
