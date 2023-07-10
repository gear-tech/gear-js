import { HexString } from '@polkadot/util/types';

type Account = 'alice' | 'bob';

export interface HumanMessageQueuedData {
  id: HexString;
  destination: HexString;
  source: HexString;
  expiration: string;
}

interface IUploadedPrograms extends IProgramSpec {
  name: string;
  messageId: HexString;
  owner: HexString;
}

interface IMessageSpec {
  id: number;
  pathToMetaTxt?: string;
  payload: undefined;
  gasLimit: number;
  value?: number;
  account: Account;
  metaType?: string;
  log?: string;
  autoReply?: boolean;
}

interface IProgramSpec {
  pathToOpt: string;
  pathToMetaTxt?: string;
  pathStates?: string[];
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

interface IState {
  id: string;
  name: string;
  functions: object;
}

interface IPreparedPrograms {
  [key: HexString]: IPreparedProgram;
}

interface IPreparedProgram {
  spec: IUploadedPrograms;
  init: boolean;
  id: HexString;
  owner: HexString;
}

interface IPreparedMessages {
  sent: Map<number, HumanMessageQueuedData>;
  log: Map<HexString, any>;
}

type IPreparedCollectionCode = Map<HexString, any>;

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
  IState,
};
