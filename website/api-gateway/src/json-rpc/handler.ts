import { IRpcRequest, IRpcResponse, logger, KAFKA_TOPICS, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';
import { kafkaEventHandler } from '../helpers/kafka-event.handler';
import { API_GATEWAY } from '../common/constant';

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
    logger.error(`${API_GATEWAY}:${JSON.stringify(JSONRPC_ERRORS.MethodNotFound)}`);
    return getResponse(procedure, JSONRPC_ERRORS.MethodNotFound.name);
  }
  const { method, params } = procedure;
  const { error, result } = await kafkaEventHandler(method, params);
  return getResponse(procedure, error, result);
}

function isExistMethod(kafkaTopic: string): boolean {
  const topics: string[] = Object.values(KAFKA_TOPICS);
  return topics.includes(kafkaTopic);
}

export { requestMessageHandler };
