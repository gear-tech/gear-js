import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { PaginationResponse } from '@/api';

import { METHOD } from './consts';
import { Program, ProgramsParameters, SetProgramMetaParameters } from './types';

const getProgram = (id: string) => INDEXER_RPC_SERVICE.callRPC<Program>(METHOD.DATA, { id });

const getPrograms = (parameters?: ProgramsParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<Program>>(METHOD.ALL, parameters);

// figure out return type
const setProgramMeta = (parameters: SetProgramMetaParameters) =>
  INDEXER_RPC_SERVICE.callRPC(METHOD.SET_META, parameters);

export { getProgram, getPrograms, setProgramMeta };
