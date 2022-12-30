import { HumanTypesRepr } from '@gear-js/api';

type IState = {
  id: string;
  name: string;
  functions: { [key: string]: HumanTypesRepr };
};

export type { IState };
