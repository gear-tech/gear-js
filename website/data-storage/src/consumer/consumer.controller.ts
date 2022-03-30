import {
  AddEventKafkaPayload,
  AddMetaParams,
  AddPayloadParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  GetMessagesParams,
  GetMetaParams,
  KafkaPayload,
  Keys,
} from '@gear-js/interfaces';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';

const logger = new Logger('ConsumerController');

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @MessagePattern('events')
  async addEvent(@Payload() payload: AddEventKafkaPayload<Keys, any>) {
    const key = payload.key;
    const value = payload.value;
    try {
      await this.consumerService.events[key](value);
    } catch (error) {
      logger.error(error.message, error.stack);
    }
  }

  @MessagePattern('program.data')
  async programData(@Payload() payload: KafkaPayload<FindProgramParams>) {
    const result = await this.consumerService.programData(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('program.all')
  async allPrograms(@Payload() payload: KafkaPayload<GetAllProgramsParams>) {
    console.log(payload);
    const result = await this.consumerService.allPrograms(payload.value);
    console.log(result);
    return JSON.stringify(result);
  }

  @MessagePattern('program.all.user')
  async allUserPrograms(@Payload() payload: KafkaPayload<GetAllUserProgramsParams>) {
    const result = await this.consumerService.allUserPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('meta.add')
  async addMeta(@Payload() payload: KafkaPayload<AddMetaParams>) {
    const result = await this.consumerService.addMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('meta.get')
  async getMeta(@Payload() payload: KafkaPayload<GetMetaParams>) {
    const result = await this.consumerService.getMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('message.all')
  async allMessages(@Payload() payload: KafkaPayload<GetMessagesParams>) {
    const result = await this.consumerService.allMessages(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('message.data')
  async messageData(@Payload() payload: KafkaPayload<FindMessageParams>) {
    const result = await this.consumerService.message(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('message.add.payload')
  async savePayload(@Payload() payload: KafkaPayload<AddPayloadParams>) {
    const result = await this.consumerService.addPayload(payload.value);
    return JSON.stringify(result);
  }
}
