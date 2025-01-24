import { PaginationResponse } from '@/api';
import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { METHOD } from './consts';
import { Code, GetCodesParameters, SetCodeMetaParameters } from './types';

const getCode = (id: string) => INDEXER_RPC_SERVICE.callRPC<Code>(METHOD.GET, { id });

const getCodes = (parameters: GetCodesParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<Code>>(METHOD.GET_ALL, parameters);

// figure out return type
const setCodeMeta = (parameters: SetCodeMetaParameters) => INDEXER_RPC_SERVICE.callRPC(METHOD.SET_META, parameters);

export { getCode, getCodes, setCodeMeta };
