import { IGenesis, ISignature } from './common';
import { IMessage } from './message';
import { IPaginationParams } from './pagination';
import { IProgram } from './program';

interface GetMessagesParams extends IGenesis, IPaginationParams, SearchParam {
  destination?: string;
  source?: string;
}

interface FindMessageParams extends IGenesis, Pick<IMessage, 'id'> {}

interface GetIncomingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'destination'> {}

interface GetOutgoingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'source'> {}

interface GetAllProgramsParams extends IGenesis, IPaginationParams, SearchParam {
  publicKeyRaw?: string;
  owner?: string;
}

interface GetAllUserProgramsParams extends IGenesis, IPaginationParams, Pick<IProgram, 'owner'>, SearchParam {}

interface FindProgramParams extends IGenesis, Pick<IProgram, 'id'> {
  owner?: string;
}

interface AddMetaParams extends IGenesis, ISignature {
  programId: string;
  meta?: string;
  metaFile?: string;
  name?: string;
  title?: string;
}

interface GetMetaParams extends IGenesis {
  programId: string;
}

interface GetTestBalanceParams extends IGenesis {
  address: string;
  token: string;
}

interface SearchParam {
  query?: string;
}

interface IRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: FindProgramParams | GetAllProgramsParams | AddMetaParams | GetMetaParams | GetMessagesParams;
}

export {
  GetMessagesParams,
  FindMessageParams,
  GetIncomingMessagesParams,
  GetOutgoingMessagesParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  FindProgramParams,
  AddMetaParams,
  GetMetaParams,
  GetTestBalanceParams,
  SearchParam,
  IRpcRequest,
};
