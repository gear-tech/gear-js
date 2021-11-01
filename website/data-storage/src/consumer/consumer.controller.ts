import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';

const logger = new Logger('ConsumerController');

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @MessagePattern('events')
  async addEvent(@Payload() payload) {
    const chain = payload.headers.chain;
    const key = payload.key;
    const value = payload.value;
    try {
      await this.consumerService.events[key](chain, value);
    } catch (error) {
      logger.error(error.message, error.stack);
    }
  }

  @MessagePattern('program.data')
  async programData(@Payload() payload) {
    console.log(payload);
  }
}
