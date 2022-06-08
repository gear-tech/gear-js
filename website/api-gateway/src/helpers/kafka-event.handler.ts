import { KAFKA_TOPICS } from '../common/kafka-producer-topics';
import {
  addMeta,
  getMeta,
  messageAll,
  messageData,
  programAll,
  programAllUsers,
  programData,
} from '../kafka/kafka-events';

export function kafkaEventHandler(event: string, params: any): Promise<any> {
  switch (event) {
    case KAFKA_TOPICS.PROGRAM_DATA:
      return programData(params);
    case KAFKA_TOPICS.PROGRAM_ALL:
      return programAll(params);
    case KAFKA_TOPICS.META_ADD:
      return addMeta(params);
    case KAFKA_TOPICS.META_GET:
      return getMeta(params);
    case KAFKA_TOPICS.PROGRAM_ALL_USER:
      return programAllUsers(params);
    case KAFKA_TOPICS.MESSAGE_ALL:
      return messageAll(params);
    case KAFKA_TOPICS.MESSAGE_DATA:
      return messageData(params);
    default:
      break;
  }
}
