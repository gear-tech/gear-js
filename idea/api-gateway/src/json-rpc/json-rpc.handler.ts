import { API_METHODS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { KafkaParams } from '../kafka/types';
import { RpcResponse } from './types';
import { IMessageNetworkDSParams, IMessageTestBalanceParams, Params } from '../rabbitmq/types';
import { producer } from '../rabbitmq/producer';
import { rabbitMQEventMap } from '../rabbitmq/init-rabbitmq';

async function handleEventByApiMethod(
  method: API_METHODS,
  params: Record<string, any> | Params | string
): Promise<RpcResponse> {
  const correlationId: string = nanoid(12);
  const genesis = params['genesis'];
  let methodEvent;
  const res: Promise<RpcResponse> = new Promise((resolve) => (methodEvent = resolve));

  if(method === API_METHODS.TEST_BALANCE_GET) {
    const messageTestBalanceParams: IMessageTestBalanceParams = { correlationId, params, genesis, method };

    await producer.sendMessageToTestBalance(messageTestBalanceParams);
    rabbitMQEventMap.set(correlationId, methodEvent);
  } else {
    const messageDataStorageParams: IMessageNetworkDSParams = {
      genesis,
      correlationId,
      method,
      params
    };

    await producer.sendMessageToDataStorage(messageDataStorageParams);
    rabbitMQEventMap.set(correlationId, methodEvent);
  }

  return res;
}

async function jsonRpcHandler(method: API_METHODS, params: KafkaParams): Promise<RpcResponse> {
  return handleEventByApiMethod(method, params);
}

export { jsonRpcHandler };
