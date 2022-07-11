import { Controller, Logger } from '@nestjs/common';
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
  Keys,
  NewEventData,
} from '@gear-js/common';

import { ConsumerService } from './consumer.service';

const logger = new Logger('ConsumerController');

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @MessagePattern('events')
  async addEvent(@Payload() payload: NewEventData<Keys, any>) {
    const key = payload.key;
    const value = payload.value;
    try {
      await this.consumerService.events[key](value);
    } catch (error) {
      logger.error(error.message, error.stack);
      logger.error({
        key,
        value,
      });
    }
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_DATA)
  async programData(@Payload() payload: KafkaPayload<FindProgramParams>): Promise<string> {
    const result = await this.consumerService.programData(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_ALL)
  async allPrograms(@Payload() payload: KafkaPayload<GetAllProgramsParams>): Promise<string> {
    const result = await this.consumerService.allPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_ALL_USER)
  async allUserPrograms(@Payload() payload: KafkaPayload<GetAllUserProgramsParams>): Promise<string> {
    const result = await this.consumerService.allUserPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_ADD)
  async addMeta(@Payload() payload: KafkaPayload<AddMetaParams>): Promise<string> {
    const result = await this.consumerService.addMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_GET)
  async getMeta(@Payload() payload: KafkaPayload<GetMetaParams>): Promise<string> {
    const result = await this.consumerService.getMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_ALL)
  async allMessages(@Payload() payload: KafkaPayload<GetMessagesParams>): Promise<string> {
    const result = await this.consumerService.allMessages(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_DATA)
  async messageData(@Payload() payload: KafkaPayload<FindMessageParams>): Promise<string> {
    const result = await this.consumerService.message(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.CODE_DATA)
  async codeData(@Payload() payload: KafkaPayload<GetCodeParams>): Promise<string> {
    const result = await this.consumerService.code(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.CODE_ALL)
  async allCode(@Payload() payload: KafkaPayload<GetAllCodeParams>): Promise<string> {
    const result = await this.consumerService.allCode(payload.value);
    return JSON.stringify(result);
  }
}
