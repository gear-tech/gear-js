import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AddMetaParams,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllProgramsParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaParams,
  KAFKA_TOPICS,
  KafkaPayload,
} from '@gear-js/common';
import { Message } from 'kafkajs';

import { ConsumerService } from './consumer.service';
import { KafkaMessagePartition } from '../decorator/kafka-message-partition.decorator';

@Controller()
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @MessagePattern(KAFKA_TOPICS.PROGRAM_DATA)
  @KafkaMessagePartition
  async programData(@Payload() payload: KafkaPayload<FindProgramParams>): Promise<string> {
    const result = await this.consumerService.programData(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_ALL)
  @KafkaMessagePartition
  async allPrograms(@Payload() payload: KafkaPayload<GetAllProgramsParams>): Promise<string> {
    const result = await this.consumerService.allPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_ADD)
  @KafkaMessagePartition
  async addMeta(@Payload() payload: KafkaPayload<AddMetaParams>): Promise<string> {
    const result = await this.consumerService.addMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_GET)
  @KafkaMessagePartition
  async getMeta(@Payload() payload: KafkaPayload<GetMetaParams>): Promise<string> {
    const result = await this.consumerService.getMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_ALL)
  @KafkaMessagePartition
  async allMessages(@Payload() payload: KafkaPayload<GetMessagesParams>): Promise<string> {
    const result = await this.consumerService.allMessages(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_DATA)
  @KafkaMessagePartition
  async messageData(@Payload() payload: KafkaPayload<FindMessageParams>): Promise<string> {
    const result = await this.consumerService.message(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.CODE_DATA)
  @KafkaMessagePartition
  async codeData(@Payload() payload: KafkaPayload<GetCodeParams>): Promise<string> {
    const result = await this.consumerService.code(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.CODE_ALL)
  @KafkaMessagePartition
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
