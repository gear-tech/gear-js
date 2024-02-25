import { MessageType, ProgramStatus } from '../../enums';
import { ICode } from '../code';
import { IDates, IGenesis, SearchParam } from '../common';
import { IMessage } from '../message';
import { IPaginationParams } from '../pagination';
import { IProgram } from '../program';
import { IState } from '../state';

export interface GetMessagesParams extends IGenesis, IPaginationParams, IDates {
  destination?: string;
  source?: string;
  mailbox?: boolean;
  type?: MessageType;
  withPrograms?: boolean;
}

export interface FindMessageParams extends IGenesis, Pick<IMessage, 'id'> {}

export interface GetIncomingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'destination'> {}

export interface GetOutgoingMessagesParams extends IGenesis, IPaginationParams, Pick<IMessage, 'source'> {}

export interface GetAllProgramsParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  publicKeyRaw?: string;
  owner?: string;
  status?: ProgramStatus | ProgramStatus[];
}

export interface GetAllStateParams extends IGenesis, SearchParam {
  programId: string;
}

export interface GetAllCodeParams extends IGenesis, IPaginationParams, SearchParam, IDates {
  name?: string;
  uploadedBy?: string;
}

export interface GetAllUserProgramsParams extends IGenesis, IPaginationParams, Pick<IProgram, 'owner'>, SearchParam {}

export interface FindProgramParams extends IGenesis, Pick<IProgram, 'id'> {
  owner?: string;
}

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
