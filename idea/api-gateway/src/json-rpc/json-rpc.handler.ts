import { API_METHODS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { RpcResponse } from './types';
import { IRMQMessageParams, Params } from '../rabbitmq/types';
import { producer } from '../rabbitmq/producer';
import { repliesMap } from '../rabbitmq/init-rabbitmq';

async function handleEventByApiMethod(
  method: API_METHODS,
  params: Record<string, any> | Params | string,
): Promise<RpcResponse> {
  const correlationId: string = nanoid(12);
  const genesis = params['genesis'];
  let replyResolve;
  const replyPromise: Promise<RpcResponse> = new Promise((resolve) => (replyResolve = resolve));

  const message: IRMQMessageParams = { correlationId, params, genesis, method };

  if (method === API_METHODS.TEST_BALANCE_GET) {
    await producer.sendMsgToTestBalance(message);
  } else {
    await producer.sendMsgToIndexer(message);
  }

  repliesMap.set(correlationId, replyResolve);

  return replyPromise;
}

async function jsonRpcHandler(method: API_METHODS, params: Params): Promise<RpcResponse> {
  return handleEventByApiMethod(method, params);
}

export { jsonRpcHandler };
