import {
  AddMetaParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
} from '@gear-js/common';

interface NetworkKafkaPartition {
  routingPartition: string;
  genesis?: string;
}

export type KafkaParams =
  | AddMetaParams
  | FindMessageParams
  | FindProgramParams
  | GetAllProgramsParams
  | GetIncomingMessagesParams
  | GetMessagesParams
  | GetMetaParams
  | GetOutgoingMessagesParams
  | GetTestBalanceParams
  | GetAllUserProgramsParams
  | NetworkKafkaPartition
