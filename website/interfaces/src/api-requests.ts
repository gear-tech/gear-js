import { IGenesis, ISignature } from './general';
import { IMessage } from './message';
import { IPaginationParams } from './pagination';
import { IProgram } from './program';

export interface AddPayloadParams extends IGenesis, ISignature, Pick<IMessage, 'id' | 'payload'> {}

export interface GetMessagesParams extends IGenesis, IPaginationParams {
  destination?: string;
  source?: string;
}

export interface FindMessageParams extends IGenesis, Pick<IMessage, 'id'> {}

export interface GetIncomingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'destination'> {}

export interface GetOutgoingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'source'> {}

export interface GetAllProgramsParams extends IGenesis, IPaginationParams {
  publicKeyRaw?: string;
  owner?: string;
  /** Search term supplied by the client. Might be either a program ID, or a part of any of its fields. */
  term?: string;
}

export interface FindProgramParams extends IGenesis, Pick<IProgram, 'id'> {
  owner?: string;
}

export interface AddMetaParams extends IGenesis, ISignature {
  programId: string;
  meta?: string;
  metaFile?: string;
  name?: string;
  title?: string;
}

export interface GetMetaParams extends IGenesis {
  programId: string;
}

export interface GetTestBalanceParams extends IGenesis {
  address: string;
}
