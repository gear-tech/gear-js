import { KAFKA_TOPICS } from '@gear-js/common';

import {
  messageAddPayload,
  messageAll,
  messageData,
  programAll,
  programAllUsers,
  programData,
  programMetaAdd,
  programMetaGet,
  testBalance,
} from '../kafka/kafka-events';
import { KafkaParams } from '../kafka/types';
import { RpcMapping } from './types';

export function jsonRpcMethodHandler(method: KAFKA_TOPICS | string, params: KafkaParams): Promise<any> {
  const getRpcMethod: RpcMapping = {
    [KAFKA_TOPICS.PROGRAM_DATA]: programData,
    [KAFKA_TOPICS.PROGRAM_ALL]: programAll,
    [KAFKA_TOPICS.PROGRAM_META_ADD]: programMetaAdd,
    [KAFKA_TOPICS.PROGRAM_META_GET]: programMetaGet,
    [KAFKA_TOPICS.PROGRAM_ALL_USER]: programAllUsers,
    [KAFKA_TOPICS.MESSAGE_ALL]: messageAll,
    [KAFKA_TOPICS.MESSAGE_DATA]: messageData,
    [KAFKA_TOPICS.MESSAGE_ADD_PAYLOAD]: messageAddPayload,
    [KAFKA_TOPICS.TEST_BALANCE_GET]: testBalance,
  };

  const rpcMethod = getRpcMethod[method];

  return rpcMethod(params);
}
