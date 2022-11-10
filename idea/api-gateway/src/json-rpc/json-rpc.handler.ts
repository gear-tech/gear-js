import { API_METHODS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { KafkaParams } from '../kafka/types';
import { kafkaEventMap, rabbitMQEventMap } from '../kafka/kafka-event-map';
import { kafkaProducer } from '../kafka/producer';
import { RpcResponse } from './types';
import { IMessageNetworkDSParams, IMessageTestBalanceParams, Params } from '../rabbitmq/types';
import { rabbitMQ } from '../rabbitmq/init-rabbitmq';

async function handleKafkaEventByTopic(topic: API_METHODS, params: KafkaParams): Promise<RpcResponse> {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(topic, params, correlationId);

  let topicEvent;
  const res: Promise<RpcResponse> = new Promise((resolve) => (topicEvent = resolve));

  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function handleRabbitMQEvent(
  method: API_METHODS,
  params: Record<string, any> | Params | string
): Promise<RpcResponse> {
  const correlationId: string = nanoid(6);
  const genesis = params['genesis'];

  if(method === API_METHODS.TEST_BALANCE_GET) {
    const messageTestBalanceParams: IMessageTestBalanceParams = { correlationId, params, genesis };

    await rabbitMQ.sendMessageToTestBalance(messageTestBalanceParams);
  } else {
    const messageDataStorageParams: IMessageNetworkDSParams = {
      genesis,
      correlationId,
      method,
      params
    };

    await rabbitMQ.sendMessageToDataStorage(messageDataStorageParams);
  }

  let methodEvent;
  const res: Promise<RpcResponse> = new Promise((resolve) => (methodEvent = resolve));

  rabbitMQEventMap.set(correlationId, methodEvent);
  return res;
}

async function jsonRpcHandler(method: API_METHODS, params: KafkaParams): Promise<RpcResponse> {
  return handleKafkaEventByTopic(method, params);
}

export { jsonRpcHandler };
