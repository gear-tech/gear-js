import { IDates, IGenesis } from './common';
import { IMessage, UpdateMessageData } from './message';
import { IPaginationParams } from './pagination';
import { IProgram } from './program';
import { IState } from './state';
import { ICode } from './code';

interface GetMessagesParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  destination?: string;
  source?: string;
  mailbox?: boolean;
}

interface FindMessageParams extends IGenesis, Pick<IMessage, 'id'> {}

interface GetIncomingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'destination'> {}

interface GetOutgoingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'source'> {}

interface GetAllProgramsParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  publicKeyRaw?: string;
  owner?: string;
  status?: string | string[];
}

interface GetAllStateParams extends IGenesis, SearchParam {
  programId: string,
}

interface GetAllCodeParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  name?: string;
  uploadedBy?: string;
}

interface GetAllUserProgramsParams extends IGenesis, IPaginationParams, Pick<IProgram, 'owner'>, SearchParam {}

interface FindProgramParams extends IGenesis, Pick<IProgram, 'id'> {
  owner?: string;
}

interface AddMetaByCodeParams extends IGenesis {
  codeId: string;
  metaHex: string;
  name?: string;
}

interface AddMetaParams extends IGenesis {
  programId: string;
  metaHex: string;
  name?: string;
}

interface AddStateParams extends IGenesis {
  programId: string;
  wasmBuffBase64: string;
  name: string;
}

interface UpdateMessagesParams {
  params: UpdateMessageData[];
}

interface GetMetaParams extends IGenesis, Pick<IProgram, 'id'> {}

interface GetStateParams extends IGenesis, Pick<IState, 'id'> {}

interface GetCodeParams extends IGenesis, Pick<ICode, 'id'> {}

interface GetStateByCodeParams extends IGenesis {
  codeId: string;
  stateId: string;
}

interface GetMetaByCodeParams extends IGenesis {
  codeId: string;
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
  params:
    | FindProgramParams
    | GetAllProgramsParams
    | AddMetaParams
    | GetMetaParams
    | GetMessagesParams
    | GetCodeParams
    | GetAllCodeParams;
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
  GetCodeParams,
  GetAllCodeParams,
  UpdateMessagesParams,
  AddStateParams,
  GetStateParams,
  GetAllStateParams,
  GetStateByCodeParams,
  GetMetaByCodeParams,
  AddMetaByCodeParams,
};
