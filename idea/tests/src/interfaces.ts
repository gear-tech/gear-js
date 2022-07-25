import { Hex } from '@gear-js/api';

type Account = 'alice' | 'bob';

interface IUploadedPrograms extends IProgramSpec {
  name: string;
  messageId: Hex;
}

interface IMessageSpec {
  id: number;
  pathToMeta?: string;
  payload: undefined;
  gasLimit: number;
  value?: number;
  account: Account;
  metaType?: string;
  log?: string;
}

interface IProgramSpec {
  pathToOpt: string;
  pathToMeta?: string;
  initPayload?: undefined;
  gasLimit: number;
  value?: number;
  account: Account;
  metaType?: string;
  shouldSuccess: boolean;
}

interface ICodeSpec {
  id: number;
  pathToOpt?: string;
  gasLimit: number;
  account: Account;
}

interface IPreparedPrograms {
  [key: Hex]: IPreparedProgram;
}

interface IPreparedProgram {
  spec: IUploadedPrograms;
  init: boolean;
  id: Hex;
}

interface IPreparedMessages {
  sent: Map<number, any>;
  log: Map<Hex, any>;
}

type IPreparedCollectionCode = Map<Hex, any>;

interface IPrepared {
  programs: IPreparedPrograms;
  messages: IPreparedMessages;
  collectionCode: IPreparedCollectionCode;
}

export type Passed = boolean;

export {
  IUploadedPrograms,
  IMessageSpec,
  IProgramSpec,
  ICodeSpec,
  IPreparedPrograms,
  IPreparedProgram,
  IPreparedMessages,
  IPrepared,
  IPreparedCollectionCode,
};
