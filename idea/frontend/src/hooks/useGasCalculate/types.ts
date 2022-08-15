import { PayloadValue } from 'components/common/Form/FormPayload/types';

export type GasMethods = 'init' | 'reply' | 'handle';

export type Values = {
  value: number;
  payload: PayloadValue;
  payloadType: string;
};
