import { RpcMethods } from 'shared/config';
import { rpcService } from 'shared/services/rpcService';
import { ICode } from 'entities/code';

import { PaginationModel } from '../types';
import { CodePaginationModel } from './types';

const fetchCode = (codeId: string) => rpcService.callRPC<ICode>(RpcMethods.GetCode, { codeId });

const fetchCodes = (params: PaginationModel) => rpcService.callRPC<CodePaginationModel>(RpcMethods.GetAllCodes, params);

export { fetchCode, fetchCodes };
