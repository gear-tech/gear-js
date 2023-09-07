import { StateFunctions } from '@gear-js/api';

import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  payload: PayloadValue;
};

type WasmFormValues = FormValues & {
  argument: PayloadValue;
};

type IState = {
  id: string;
  name: string;
  functions: StateFunctions;
};

export type { FormValues, WasmFormValues, IState };
