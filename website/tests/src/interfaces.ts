import { Hex } from '@gear-js/api';

export interface IUploadedPrograms extends IProgramSpec {
  name: string;
}

export interface IMessageSpec {
  id: number;
  pathToMeta?: string;
  payload: undefined;
  gasLimit: number;
  value?: number;
  account: 'alice' | 'bob';
  metaType?: string;
  log?: string;
}

export interface IProgramSpec {
  pathToOpt: string;
  pathToMeta?: string;
  initPayload?: undefined;
  gasLimit: number;
  value?: number;
  account: 'alice' | 'bob';
  metaType?: string;
  shouldSuccess: boolean;
}

export interface IPreparedPrograms {
  [key: Hex]: {
    spec: any;
    init: boolean;
    id: Hex;
  };
}

export interface IPreparedMessages {
  sent: Map<number, any>;
  log: Map<string, any>;
}
