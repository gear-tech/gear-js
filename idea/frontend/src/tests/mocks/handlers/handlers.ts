import { rest } from 'msw';

import { GET_NODES_RESPONSE } from './const';
import { getMessageResponse, getProgramResponse, getMetadataResponse } from './helpers';

import { DEFAULT_NODES_URL, API_URL, RPC_METHODS } from 'consts';
import { RPCRequest } from 'services/ServerRPCRequestService';

const gearNodes = rest.get(DEFAULT_NODES_URL, (_req, res, ctx) => res(ctx.json(GET_NODES_RESPONSE)));

const gearApi = rest.post<RPCRequest>(API_URL, (req, res, ctx) => {
  const { method, params } = req.body;

  switch (method) {
    case RPC_METHODS.GET_MESSAGE: {
      const messageId = (params as any).id;

      const responseData = getMessageResponse(messageId);

      return res(ctx.json(responseData));
    }
    case RPC_METHODS.PROGRAM_DATA: {
      const programId = (params as any).id;

      const responseData = getProgramResponse(programId);

      return res(ctx.json(responseData));
    }
    case RPC_METHODS.GET_METADATA: {
      const programId = (params as any).programId;

      const responseData = getMetadataResponse(programId);

      return res(ctx.json(responseData));
    }
    case RPC_METHODS.ADD_METADATA: {
      return res(ctx.json({}));
    }
    default:
      return res();
  }
});

const handlers = [gearNodes, gearApi];

export { handlers };
