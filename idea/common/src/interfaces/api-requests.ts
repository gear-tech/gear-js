import { IDates, IGenesis } from './common';
import { IMessage } from './message';
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
  programId: string;
}

interface GetAllCodeParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  name?: string;
  uploadedBy?: string;
}

interface GetAllUserProgramsParams extends IGenesis, IPaginationParams, Pick<IProgram, 'owner'>, SearchParam {}

interface FindProgramParams extends IGenesis, Pick<IProgram, 'id'> {
  owner?: string;
}

interface AddMetaParams extends IGenesis {
  hex: string;
}

interface AddCodeNameParams extends IGenesis, Pick<ICode, 'id'> {
  name: string;
}

interface AddProgramNameParams extends IGenesis, Pick<IProgram, 'id'> {
  name: string;
}

interface AddStateParams extends IGenesis {
  programId: string;
  wasmBuffBase64: string;
  name: string;
}

interface GetMetaParams extends IGenesis {
  hash: string;
}

interface GetStateParams extends IGenesis, Pick<IState, 'id'> {}

interface GetCodeParams extends IGenesis, Pick<ICode, 'id'> {}

interface GetStateByCodeParams extends IGenesis {
  codeId: string;
  stateId: string;
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
    | GetMessagesParams
    | GetCodeParams
    | GetMetaParams
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
  GetTestBalanceParams,
  SearchParam,
  IRpcRequest,
  GetCodeParams,
  GetAllCodeParams,
  AddStateParams,
  GetStateParams,
  GetAllStateParams,
  GetStateByCodeParams,
  GetMetaParams,
  AddMetaParams,
  AddCodeNameParams,
  AddProgramNameParams,
};
