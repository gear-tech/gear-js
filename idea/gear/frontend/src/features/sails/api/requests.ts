import type { HexString } from '@gear-js/api';

import type { PaginationResponse } from '@/api';
import { METADATA_STORAGE_API_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';
import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { METHOD } from './consts';
import type { EventType, GetEventsParameters, GetIdlResponse } from './types';

const getIdl = (codeId: HexString) => {
  const url = new URL(`${METADATA_STORAGE_API_URL}/sails`);
  url.searchParams.append('codeId', codeId);

  return fetchWithGuard<GetIdlResponse>({ url });
};

const addIdl = (codeId: HexString, data: string) =>
  fetchWithGuard({
    url: `${METADATA_STORAGE_API_URL}/sails`,
    method: 'POST',
    parameters: { codeId, data },
  });

const getEvents = (parameters: GetEventsParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<EventType>>(METHOD.GET_EVENTS, parameters);

export { addIdl, getEvents, getIdl };
