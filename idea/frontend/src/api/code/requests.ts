import { HexString } from '@polkadot/util/types';

import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';
import { ICode } from '@/entities/code';

import { PaginationModel } from '../types';
import { CodePaginationModel } from './types';

const fetchCode = (id: string) => rpcService.callRPC<ICode>(RpcMethods.GetCode, { id });

const addCodeName = (params: { id: HexString; name: string }) => rpcService.callRPC(RpcMethods.AddCodeName, params);

const fetchCodes = (params: PaginationModel) => rpcService.callRPC<CodePaginationModel>(RpcMethods.GetAllCodes, params);

export { fetchCode, fetchCodes, addCodeName };
