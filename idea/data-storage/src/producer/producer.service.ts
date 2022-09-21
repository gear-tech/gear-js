import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('DATA_STORAGE') private kafkaProducer: Producer
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.kafkaProducer.disconnect();
  }

  async sendMessage() {
    return this.kafkaProducer.send({
      topic: 'service.reply',
      messages: [
        {
          value: JSON.stringify('data_storage'),
        },
      ],
    });
  }
}
