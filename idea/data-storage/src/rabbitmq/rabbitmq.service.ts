import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, Connection, connect, Replies } from 'amqplib';
import {
  AddMetaParams,
  API_METHODS, FindMessageParams,
  FindProgramParams, GetAllCodeParams,
  GetAllProgramsParams, GetCodeParams, GetMessagesParams, GetMetaParams,
  RabbitMQExchanges,
  RabbitMQueues,
} from '@gear-js/common';

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { MetadataService } from '../metadata/metadata.service';
import { CodeService } from '../code/code.service';
import { BlockService } from '../block/block.service';
import { RabbitmqMessageParams } from './types/rabbitmq-params';
import { FormResponse } from '../decorator/form-response.decorator';

@Injectable()
export class RabbitmqService {
  private logger: Logger = new Logger(RabbitmqService.name);
  private mainChannel: Channel;
  private topicChannel: Channel;
  private connection: Connection;

  constructor(
    private configService: ConfigService,
    private messageService: MessageService,
    private metaService: MetadataService,
    private codeService: CodeService,
    private programService: ProgramService,
    private blockService: BlockService,
  ) {}

  public async connect(): Promise<void> {
    this.connection = await connect(this.configService.get<string>('rabbitmq.url'));
    console.log('📍 RabbitMQ connected successfully');
  }

  public async initRMQ(genesis: string): Promise<void> {
    try {
      this.mainChannel = await this.connection.createChannel();
      this.topicChannel = await this.connection.createChannel();

      const directExchange = RabbitMQExchanges.DIRECT_EX;
      const topicExchange = RabbitMQExchanges.TOPIC_EX;
      const directExchangeType = 'direct';
      const routingKey = `ds.${genesis}`;

      const messageBuff = JSON.stringify({ service: 'ds', action: 'add', genesis });
      //send genesis to api-gateway
      this.mainChannel.sendToQueue(RabbitMQueues.GENESISES, Buffer.from(messageBuff));

      await this.mainChannel.assertExchange(directExchange, directExchangeType, {});
      await this.topicChannel.assertExchange(topicExchange, 'topic', {});

      const assertQueue = await this.mainChannel.assertQueue(`ds.AQ.${genesis}`, {
        durable: false,
        autoDelete: true,
        exclusive: false
      });
      const assertTopicQueue = await this.topicChannel.assertQueue(`ds.ATQ.${genesis}`, {
        durable: false,
        exclusive: false,
        autoDelete: true
      });

      await this.mainChannel.bindQueue(assertQueue.queue, directExchange, routingKey);
      await this.topicChannel.bindQueue(assertTopicQueue.queue, topicExchange, 'ds.genesises');

      await this.directMessageConsumer(assertQueue);
      await this.topicMessageConsumer(assertTopicQueue, genesis);
    } catch (error) {
      this.logger.error('Init RMQ error');
      this.logger.error(error);
    }
  }

  public async sendDeleteGenesis(genesis: string): Promise<void> {
    const messageBuff = JSON.stringify({ service: 'ds', action: 'delete', genesis });
    this.mainChannel.sendToQueue(RabbitMQueues.GENESISES, Buffer.from(messageBuff));
  }


  private async directMessageConsumer(repliesAssertQueue: Replies.AssertQueue): Promise<void>{
    try {
      await this.mainChannel.consume(repliesAssertQueue.queue, async (message) => {
        if(!message){
          return;
        }
        const method = message.properties.headers.method;

        const params = JSON.parse(message.content.toString());
        const correlationId = message.properties.correlationId;

        const result = await this.handleEventByMethod(method, params);

        const messageBuff = JSON.stringify(result);
        this.mainChannel.sendToQueue(RabbitMQueues.REPLIES, Buffer.from(messageBuff), { correlationId });
      });
    } catch (error) {
      this.logger.error(new Date());
      this.logger.error(`Direct exchange consumer ${JSON.stringify(error)}`);
    }
  }

  private async topicMessageConsumer(repliesAssertQueue: Replies.AssertQueue, genesis): Promise<void> {
    try {
      await this.topicChannel.consume(repliesAssertQueue.queue, async (message) => {
        if(!message){
          return;
        }

        const messageBuff = JSON.stringify({ service: 'ds', action: 'add', genesis });
        this.mainChannel.sendToQueue(RabbitMQueues.GENESISES, Buffer.from(messageBuff));
      });
    } catch (error) {
      this.logger.error(new Date());
      this.logger.error(`Topic exchange consumer ${JSON.stringify(error)}`);
    }
  }

  @FormResponse
  private async handleEventByMethod(method: string, params: RabbitmqMessageParams): Promise<any> {
    const methods = {
      [API_METHODS.PROGRAM_DATA]: () => {
        return this.programService.findProgram(params as FindProgramParams);
      },
      [API_METHODS.PROGRAM_ALL]: () => {
        return this.programService.getAllPrograms(params as GetAllProgramsParams);
      },
      [API_METHODS.PROGRAM_META_ADD]: () => {
        return this.metaService.addMeta(params as AddMetaParams);
      },
      [API_METHODS.PROGRAM_META_GET]: () => {
        return this.metaService.getMeta(params as GetMetaParams);
      },
      [API_METHODS.MESSAGE_ALL]: () => {
        return this.messageService.getAllMessages(params as GetMessagesParams);
      },
      [API_METHODS.MESSAGE_DATA]: () => {
        return this.messageService.getMessage(params as FindMessageParams);
      },
      [API_METHODS.CODE_ALL]: () => {
        return this.codeService.getAllCode(params as GetAllCodeParams);
      },
      [API_METHODS.CODE_DATA]: () => {
        return this.codeService.getByIdAndGenesis(params as GetCodeParams);
      },
      [API_METHODS.BLOCKS_STATUS]: () => {
        return this.blockService.getLastBlock(params.genesis as string);
      },
    };

    return methods[method]();
  }
}
