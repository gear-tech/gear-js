import {
  AddMetaParams,
  AddPayloadParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  GetMessagesParams,
  GetMetaParams,
  GetTestBalanceParams,
  KAFKA_TOPICS,
} from '@gear-js/common';

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

export function jsonRpcMethodHandler(method: string, params: KafkaParams): Promise<any> {
  switch (method) {
    case KAFKA_TOPICS.PROGRAM_DATA:
      return programData(params as FindProgramParams);
    case KAFKA_TOPICS.PROGRAM_ALL:
      return programAll(params as GetAllProgramsParams);
    case KAFKA_TOPICS.PROGRAM_META_ADD:
      return programMetaAdd(params as AddMetaParams);
    case KAFKA_TOPICS.PROGRAM_META_GET:
      return programMetaGet(params as GetMetaParams);
    case KAFKA_TOPICS.PROGRAM_ALL_USER:
      return programAllUsers(params as GetAllUserProgramsParams);
    case KAFKA_TOPICS.MESSAGE_ALL:
      return messageAll(params as GetMessagesParams);
    case KAFKA_TOPICS.MESSAGE_DATA:
      return messageData(params as FindMessageParams);
    case KAFKA_TOPICS.MESSAGE_ADD_PAYLOAD:
      return messageAddPayload(params as AddPayloadParams);
    case KAFKA_TOPICS.TEST_BALANCE_GET:
      return testBalance(params as GetTestBalanceParams);
    default:
      break;
  }
}
