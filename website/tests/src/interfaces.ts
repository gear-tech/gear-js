import { Hex } from '@gear-js/api';

export interface IUploadedPrograms extends IProgramSpec {
  name: string;
  messageId: Hex;
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
  [key: Hex]: IPreparedProgram;
}

export interface IPreparedProgram {
  spec: IUploadedPrograms;
  init: boolean;
  id: Hex;
}

export interface IPreparedMessages {
  sent: Map<number, any>;
  log: Map<Hex, any>;
}

export interface IPrepared {
  programs: IPreparedPrograms;
  messages: IPreparedMessages;
}

export type Passed = boolean;
