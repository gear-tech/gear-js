import { KAFKA_TOPICS } from '@gear-js/common';

import {
  codeAll,
  codeData,
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
import { RpcMethods } from './types';

const rpcMethods: RpcMethods = {
  [KAFKA_TOPICS.PROGRAM_DATA]: programData,
  [KAFKA_TOPICS.PROGRAM_ALL]: programAll,
  [KAFKA_TOPICS.PROGRAM_META_ADD]: programMetaAdd,
  [KAFKA_TOPICS.PROGRAM_META_GET]: programMetaGet,
  [KAFKA_TOPICS.PROGRAM_ALL_USER]: programAllUsers,
  [KAFKA_TOPICS.MESSAGE_ALL]: messageAll,
  [KAFKA_TOPICS.MESSAGE_DATA]: messageData,
  [KAFKA_TOPICS.TEST_BALANCE_GET]: testBalance,
  [KAFKA_TOPICS.CODE_DATA]: codeData,
  [KAFKA_TOPICS.CODE_ALL]: codeAll,
};

export function jsonRpcMethodHandler(method: KAFKA_TOPICS | string, params: KafkaParams): Promise<any> {
  const rpcMethod = rpcMethods[method];

  return rpcMethod(params);
}
