import { Channel, connect, Connection } from 'amqplib';
import {
  FormResponse,
  RabbitMQExchanges,
  RabbitMQueues,
  RMQServices,
  META_STORAGE_METHODS,
  META_STORAGE_INTERNAL_METHODS,
} from '@gear-js/common';

import { logger } from './logger';
import config from './config';
import { MetaService } from './service';

export class RMQService {
  private channel: Channel;
  private connection: Connection;
  private methods: Record<META_STORAGE_METHODS | META_STORAGE_INTERNAL_METHODS, (params: any) => Promise<any>>;

  constructor(private metaService: MetaService) {
    this.methods = {
      [META_STORAGE_METHODS.META_ADD]: this.metaService.addMetaDetails.bind(this.metaService),
      [META_STORAGE_METHODS.META_GET]: this.metaService.get.bind(this.metaService),
      [META_STORAGE_INTERNAL_METHODS.META_HASH_ADD]: this.metaService.addMeta.bind(this.metaService),
    };
  }

  public async init(): Promise<void> {
    this.connection = await connect(config.rmq.url);

    try {
      this.channel = await this.connection.createChannel();

      const directExchange = RabbitMQExchanges.DIRECT_EX;
      const directExchangeType = 'direct';

      await this.channel.assertExchange(directExchange, directExchangeType);
      await this.channel.assertQueue(RMQServices.META_STORAGE, {
        durable: true,
        exclusive: false,
        autoDelete: false,
      });

      await this.channel.bindQueue(RMQServices.META_STORAGE, RabbitMQExchanges.DIRECT_EX, RMQServices.META_STORAGE);

      await this.directMsgConsumer(RMQServices.META_STORAGE);

      this.connection.on('close', (error) => {
        console.log(new Date(), error);
        process.exit(1);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private sendMsg(
    exchange: RabbitMQExchanges,
    queue: RabbitMQueues,
    params: any,
    correlationId?: string,
    method?: string,
  ): void {
    const messageBuff = JSON.stringify(params);
    this.channel.publish(exchange, queue, Buffer.from(messageBuff), { correlationId, headers: { method } });
  }

  private async directMsgConsumer(queue: string): Promise<void> {
    try {
      await this.channel.consume(
        queue,
        async (msg) => {
          if (!msg) {
            return;
          }
          const method = msg.properties.headers.method;

          const params = JSON.parse(msg.content.toString());
          const correlationId = msg.properties.correlationId;

          const result = await this.handleIncomingMsg(method, params);

          this.sendMsg(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES, result, correlationId);
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Direct exchange consumer ${JSON.stringify(error)}`);
    }
  }

  @FormResponse
  private async handleIncomingMsg(method: META_STORAGE_METHODS, params: any): Promise<any> {
    return this.methods[method](params);
  }
}
