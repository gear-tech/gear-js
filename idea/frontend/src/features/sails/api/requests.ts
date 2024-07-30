import { HexString } from '@gear-js/api';

import { PaginationResponse } from '@/api';
import { INDEXER_RPC_SERVICE, rpcService } from '@/shared/services/rpcService';

import { EventType, GetEventsParameters } from './types';
import { METHOD } from './consts';

const addIdl = (codeId: HexString, data: string) => rpcService.callRPC(METHOD.ADD_SAILS, { codeId, data });
const getIdl = (codeId: HexString) => rpcService.callRPC<string>(METHOD.GET_SAILS, { codeId });

const getEvents = (parameters: GetEventsParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<EventType>>(METHOD.GET_EVENTS, parameters);

export { addIdl, getIdl, getEvents };
