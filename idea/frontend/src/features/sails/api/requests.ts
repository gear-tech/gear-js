import { HexString } from '@gear-js/api';
import ky from 'ky';

import { PaginationResponse } from '@/api';
import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';
import { META_STORAGE_API_URL } from '@/shared/config';

import { EventType, GetEventsParameters } from './types';
import { METHOD } from './consts';

type GetIdlResult = {
  codeId: string;
  data: string;
};

const getIdl = (codeId: HexString) =>
  ky
    .get(`${META_STORAGE_API_URL}/sails`, {
      searchParams: { codeId },
    })
    .json<GetIdlResult>();

const addIdl = (codeId: HexString, data: string) =>
  ky.post(`${META_STORAGE_API_URL}/sails`, {
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ codeId, data }),
  });

const getEvents = (parameters: GetEventsParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<EventType>>(METHOD.GET_EVENTS, parameters);

export { addIdl, getIdl, getEvents };
