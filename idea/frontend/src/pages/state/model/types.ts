import { HumanTypesRepr } from '@gear-js/api';

import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  payload: PayloadValue;
};

type IFunctions = Record<string, HumanTypesRepr>;

type IState = {
  id: string;
  name: string;
  functions: IFunctions;
};

export type { FormValues, IState, IFunctions };
