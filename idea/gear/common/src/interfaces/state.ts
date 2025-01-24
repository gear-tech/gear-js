import { StateFunctions } from '@gear-js/api';

export interface IState {
  id: string;
  name: string;
  wasmBuffBase64?: string;
  functions: StateFunctions;
  funcNames?: string[];
}
