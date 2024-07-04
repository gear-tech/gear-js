import { HexString } from '@gear-js/api';

import { rpcService } from '@/shared/services/rpcService';

const METHOD = {
  ADD: 'sails.add',
  GET: 'sails.get',
} as const;

const addIdl = (codeId: HexString, data: string) => rpcService.callRPC(METHOD.ADD, { codeId, data });
const getIdl = (codeId: HexString) => rpcService.callRPC<string>(METHOD.GET, { codeId });

export { addIdl, getIdl };
