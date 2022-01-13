import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';

const logger = new Logger('ConsumerController');

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @MessagePattern('events')
  async addEvent(@Payload() payload) {
    logger.log(payload.value, 'AddEvent');
    const genesis = payload.headers.genesis;
    const key = payload.key;
    const value = payload.value;
    try {
      await this.consumerService.events[key](genesis, value);
    } catch (error) {
      logger.error(error.message, error.stack);
    }
  }

  @MessagePattern('program.data')
  async programData(@Payload() payload) {
    const result = await this.consumerService.programData(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('program.all')
  async allPrograms(@Payload() payload) {
    const result = await this.consumerService.allPrograms(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('meta.add')
  async addMeta(@Payload() payload) {
    const result = await this.consumerService.addMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('meta.get')
  async getMeta(@Payload() payload) {
    const result = await this.consumerService.getMeta(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('message.all')
  async allMessages(@Payload() payload) {
    console.log(payload.value);
    const result = await this.consumerService.allMessages(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('message.data')
  async messageData(@Payload() payload) {
    const result = await this.consumerService.message(payload.value);
    return JSON.stringify(result);
  }

  @MessagePattern('message.add.payload')
  async savePayload(@Payload() payload) {
    const result = await this.consumerService.addPayload(payload.value);
    return JSON.stringify(result);
  }
}
