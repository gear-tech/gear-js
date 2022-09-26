import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AddMetaParams,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaParams,
  KAFKA_TOPICS,
  KafkaPayload,
} from '@gear-js/common';
import { Message } from 'kafkajs';

import { ConsumerService } from './consumer.service';
import { ValidateKafkaEventPartition } from '../middleware/validate-kafka-event-partition.middleware';

@Controller()
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @MessagePattern(KAFKA_TOPICS.PROGRAM_DATA)
  @ValidateKafkaEventPartition
  async programData(@Payload() payload: KafkaPayload<FindProgramParams>): Promise<string> {
    const result = await this.consumerService.programData(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_ALL)
  @ValidateKafkaEventPartition
  async allPrograms(@Payload() payload: KafkaPayload<GetAllProgramsParams>): Promise<string> {
    const result = await this.consumerService.allPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_ALL_USER)
  @ValidateKafkaEventPartition
  async allUserPrograms(@Payload() payload: KafkaPayload<GetAllUserProgramsParams>): Promise<string> {
    const result = await this.consumerService.allUserPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_ADD)
  @ValidateKafkaEventPartition
  async addMeta(@Payload() payload: KafkaPayload<AddMetaParams>): Promise<string> {
    const result = await this.consumerService.addMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_GET)
  @ValidateKafkaEventPartition
  async getMeta(@Payload() payload: KafkaPayload<GetMetaParams>): Promise<string> {
    const result = await this.consumerService.getMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_ALL)
  @ValidateKafkaEventPartition
  async allMessages(@Payload() payload: KafkaPayload<GetMessagesParams>): Promise<string> {
    const result = await this.consumerService.allMessages(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_DATA)
  @ValidateKafkaEventPartition
  async messageData(@Payload() payload: KafkaPayload<FindMessageParams>): Promise<string> {
    const result = await this.consumerService.message(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.CODE_DATA)
  @ValidateKafkaEventPartition
  async codeData(@Payload() payload: KafkaPayload<GetCodeParams>): Promise<string> {
    const result = await this.consumerService.code(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.CODE_ALL)
  @ValidateKafkaEventPartition
  async allCode(@Payload() payload: KafkaPayload<GetAllCodeParams>): Promise<string> {
    const result = await this.consumerService.allCode(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.SERVICE_PARTITION_GET)
  async servicePartitionGet(@Payload() payload: Message): Promise<void> {
    await this.consumerService.servicePartitionGet(payload);
  }

  @MessagePattern(KAFKA_TOPICS.SERVICES_PARTITION)
  async servicesPartition(@Payload() payload: Message): Promise<void> {
    await this.consumerService.servicesPartition();
  }
}
