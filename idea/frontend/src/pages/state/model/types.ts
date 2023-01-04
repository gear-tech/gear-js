import { HumanTypesRepr } from '@gear-js/api';

import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  payload: PayloadValue;
};

type IState = {
  id: string;
  name: string;
  functions: { [key: string]: HumanTypesRepr };
};

export type { FormValues, IState };
