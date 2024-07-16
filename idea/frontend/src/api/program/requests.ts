import { HexString } from '@polkadot/util/types';

import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';
import { IProgram } from '@/features/program';

import { FetchProgramsParams, ProgramPaginationModel } from './types';

const fetchProgram = (id: string) => rpcService.callRPC<IProgram>(RpcMethods.GetProgram, { id });

const addProgramName = (id: HexString, name: string) => rpcService.callRPC(RpcMethods.AddProgramName, { id, name });

const fetchPrograms = (params: FetchProgramsParams) =>
  rpcService.callRPC<ProgramPaginationModel>(RpcMethods.GetAllPrograms, params);

export { fetchProgram, fetchPrograms, addProgramName };
