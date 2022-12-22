export interface IState {
  id: string;
  name: string;
  wasmBuffBase64?: string;
  functions: {[key: string]: any};
  funcNames: string[];
}
