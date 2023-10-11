import { rpcService } from '@/shared/services/rpcService';
import { RpcMethods } from '@/shared/config';

import { FetchTestBalanceParams } from './types';

const fetchTestBalance = (params: FetchTestBalanceParams) => rpcService.callRPC(RpcMethods.GetTestBalance, params);

export { fetchTestBalance };
