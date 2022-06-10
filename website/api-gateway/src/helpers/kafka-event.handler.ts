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
} from '../kafka/kafka-events';

export function kafkaEventHandler(event: string, params: any): Promise<any> {
  switch (event) {
    case KAFKA_TOPICS.PROGRAM_DATA:
      return programData(params);
    case KAFKA_TOPICS.PROGRAM_ALL:
      return programAll(params);
    case KAFKA_TOPICS.PROGRAM_META_ADD:
      return programMetaAdd(params);
    case KAFKA_TOPICS.PROGRAM_META_GET:
      return programMetaGet(params);
    case KAFKA_TOPICS.PROGRAM_ALL_USER:
      return programAllUsers(params);
    case KAFKA_TOPICS.MESSAGE_ALL:
      return messageAll(params);
    case KAFKA_TOPICS.MESSAGE_DATA:
      return messageData(params);
    case KAFKA_TOPICS.MESSAGE_ADD_PAYLOAD:
      return messageAddPayload(params);
    default:
      break;
  }
}
