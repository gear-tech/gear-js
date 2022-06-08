import { IRpcRequest, IRpcResponse } from '@gear-js/interfaces';
import errors from '@gear-js/jsonrpc-errors';

import { getResponse } from '../utils';
import { kafkaProducerTopics } from '../common/kafka-producer-topics';
import { kafkaEventHandler } from '../helpers/kafka-event.handler';
import { logger } from '../helpers/logger';

async function requestMessageHandler(message: IRpcRequest | IRpcRequest[]): Promise<IRpcResponse | IRpcResponse[]> {
  if (Array.isArray(message)) {
    const promises = message.map((rpcMessage) => {
      return executeProcedure(rpcMessage);
    });
    const result = await Promise.all(promises);
    return result;
  } else {
    return executeProcedure(message);
  }
}

async function executeProcedure(procedure: IRpcRequest): Promise<IRpcResponse> {
  if (!isExistMethod(procedure.method)) {
    logger.error(JSON.stringify(errors.MethodNotFound));
    return getResponse(procedure, 'MethodNotFound');
  }
  const { method, params } = procedure;
  const { error, result } = await kafkaEventHandler(method, params);
  return getResponse(procedure, error, result);
}

function isExistMethod(kafkaTopic: string): boolean {
  const topics = Object.values(kafkaProducerTopics);
  return topics.includes(kafkaTopic);
}

export { requestMessageHandler };
