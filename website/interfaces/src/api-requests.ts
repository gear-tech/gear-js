import { IGenesis, ISignature } from './general';
import { IMessage } from './message';
import { IPaginationParams } from './pagination';
import { IProgram } from './program';

export interface AddPayloadParams extends IGenesis, ISignature, Pick<IMessage, 'id' | 'payload'> {}

export interface GetMessagesParams extends IGenesis, IPaginationParams, SearchParam {
  destination?: string;
  source?: string;
}

export interface FindMessageParams extends IGenesis, Pick<IMessage, 'id'> {}

export interface GetIncomingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'destination'> {}

export interface GetOutgoingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'source'> {}

export interface GetAllProgramsParams extends IGenesis, IPaginationParams, SearchParam {
  publicKeyRaw?: string;
  owner?: string;
}

export interface GetAllUserProgramsParams extends IGenesis, IPaginationParams, Pick<IProgram, 'owner'>, SearchParam {}

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
  token: string;
}

export interface SearchParam {
  query?: string;
}
