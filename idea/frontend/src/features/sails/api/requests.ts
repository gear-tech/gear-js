import { HexString } from '@gear-js/api';

import { PaginationResponse } from '@/api';
import { CONTENT_TYPE_HEADERS, METADATA_STORAGE_API_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';
import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { EventType, GetEventsParameters, GetIdlResponse } from './types';
import { METHOD } from './consts';

const getIdl = (codeId: HexString) => {
  const url = new URL(`${METADATA_STORAGE_API_URL}/sails`);
  url.searchParams.append('codeId', codeId);

  return fetchWithGuard<GetIdlResponse>(url, { method: 'GET' });
};

const addIdl = (codeId: HexString, data: string) =>
  fetchWithGuard(`${METADATA_STORAGE_API_URL}/sails`, {
    method: 'POST',
    headers: CONTENT_TYPE_HEADERS,
    body: JSON.stringify({ codeId, data }),
  });

const getEvents = (parameters: GetEventsParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<EventType>>(METHOD.GET_EVENTS, parameters);

export { addIdl, getIdl, getEvents };
