import type { MessageType, ProgramStatus } from '../../enums/index.js';
import type { ICode } from '../code.js';
import type { IDates, IGenesis, SearchParam } from '../common.js';
import type { IMessage } from '../message.js';
import type { IPaginationParams } from '../pagination.js';
import type { IProgram } from '../program.js';
import type { IState } from '../state.js';

export interface GetMessagesParams extends IGenesis, IPaginationParams, IDates {
  destination?: string;
  source?: string;
  mailbox?: boolean;
  type?: MessageType;
  withPrograms?: boolean;
}

export interface FindMessageParams extends IGenesis, Pick<IMessage, 'id'> {
  withMetahash?: boolean;
}

export interface GetIncomingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'destination'> {}

export interface GetOutgoingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'source'> {}

export interface GetAllProgramsParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  owner?: string;
  status?: ProgramStatus | ProgramStatus[];
  codeId?: string;
}

export interface GetAllStateParams extends IGenesis, SearchParam {
  programId: string;
}

export interface GetAllCodeParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  name?: string;
  uploadedBy?: string;
}

export interface GetAllUserProgramsParams extends IGenesis, IPaginationParams, Pick<IProgram, 'owner'>, SearchParam {}

export interface FindProgramParams extends IGenesis, Pick<IProgram, 'id'> {}

export interface AddCodeNameParams extends IGenesis, Pick<ICode, 'id'> {
  name: string;
}

export interface AddProgramNameParams extends IGenesis, Pick<IProgram, 'id'> {
  name: string;
}

export interface AddStateParams extends IGenesis {
  programId: string;
  wasmBuffBase64: string;
  name: string;
}

export interface GetStateParams extends IGenesis, Pick<IState, 'id'> {}

export interface GetCodeParams extends IGenesis, Pick<ICode, 'id'> {}

export interface GetStateByCodeParams extends IGenesis {
  codeId: string;
  stateId: string;
}
