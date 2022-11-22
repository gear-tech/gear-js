import { API_METHODS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { RpcResponse } from './types';
import { IMessageDataStorageParams, IMessageTestBalanceParams, Params } from '../rabbitmq/types';
import { producer } from '../rabbitmq/producer';
import { repliesMap } from '../rabbitmq/init-rabbitmq';

async function handleEventByApiMethod(
  method: API_METHODS,
  params: Record<string, any> | Params | string
): Promise<RpcResponse> {
  const correlationId: string = nanoid(12);
  const genesis = params['genesis'];
  let replyResolve;
  const replyPromise: Promise<RpcResponse> = new Promise((resolve) => (replyResolve = resolve));

  if(method === API_METHODS.TEST_BALANCE_GET) {
    const messageTestBalanceParams: IMessageTestBalanceParams = { correlationId, params, genesis, method };

    await producer.sendMessageToTestBalance(messageTestBalanceParams);
  } else {
    const messageDataStorageParams: IMessageDataStorageParams = {
      genesis,
      correlationId,
      method,
      params
    };

    await producer.sendMessageToDataStorage(messageDataStorageParams);
  }

  repliesMap.set(correlationId, replyResolve);

  return replyPromise;
}

async function jsonRpcHandler(method: API_METHODS, params: Params): Promise<RpcResponse> {
  return handleEventByApiMethod(method, params);
}

export { jsonRpcHandler };
