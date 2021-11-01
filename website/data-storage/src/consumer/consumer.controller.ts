import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';

const logger = new Logger('ConsumerController');

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @MessagePattern('events')
  async addEvent(@Payload() payload) {
    console.log(new Date(payload.value.date));
    const chain = payload.headers.chain;
    const key = payload.key;
    const value = payload.value;
    console.log(`Timestamp: ${payload.timestamp}`);
    console.log(`Chain: ${chain}`);
    console.log(`Key: ${key}`);
    console.log(value);
    try {
      await this.consumerService.events[key](chain, value);
    } catch (error) {
      logger.error(error.message, error.stack);
    }
  }
}
