import { Controller, Logger } from '@nestjs/common';
import {
  AddMetaParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  GetMessagesParams,
  GetMetaParams,
  KAFKA_TOPICS,
  KafkaPayload,
  Keys,
  NewEventData,
} from '@gear-js/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
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
  async programData(@Payload() payload: KafkaPayload<FindProgramParams>) {
    const result = await this.consumerService.programData(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_ALL)
  async allPrograms(@Payload() payload: KafkaPayload<GetAllProgramsParams>) {
    const result = await this.consumerService.allPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_ALL_USER)
  async allUserPrograms(@Payload() payload: KafkaPayload<GetAllUserProgramsParams>) {
    const result = await this.consumerService.allUserPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_ADD)
  async addMeta(@Payload() payload: KafkaPayload<AddMetaParams>) {
    const result = await this.consumerService.addMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.PROGRAM_META_GET)
  async getMeta(@Payload() payload: KafkaPayload<GetMetaParams>) {
    const result = await this.consumerService.getMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_ALL)
  async allMessages(@Payload() payload: KafkaPayload<GetMessagesParams>) {
    const result = await this.consumerService.allMessages(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern(KAFKA_TOPICS.MESSAGE_DATA)
  async messageData(@Payload() payload: KafkaPayload<FindMessageParams>) {
    const result = await this.consumerService.message(payload.value);
    return JSON.stringify(result);
  }
}
