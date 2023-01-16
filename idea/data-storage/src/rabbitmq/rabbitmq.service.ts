import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, connect, Connection, Replies } from 'amqplib';
import {
  AddMetaParams,
  AddStateParams,
  API_METHODS,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllProgramsParams,
  GetAllStateParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaParams,
  GetStateByCodeParams,
  GetStateParams,
  RabbitMQExchanges,
  RabbitMQueues,
} from '@gear-js/common';

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { MetaService } from '../meta/meta.service';
import { CodeService } from '../code/code.service';
import { BlockService } from '../block/block.service';
import { RabbitmqMessageParams } from './types/rabbitmq-params';
import { FormResponse } from '../decorator/form-response.decorator';
import { StateService } from '../state/state.service';
import { StateToCodeService } from '../state-to-code/state-to-code.service';

@Injectable()
export class RabbitmqService {
  private logger: Logger = new Logger(RabbitmqService.name);
  private mainChannel: Channel;
  private topicChannel: Channel;
  public connection: Connection;

  constructor(
    private configService: ConfigService,
    private messageService: MessageService,
    @Inject(forwardRef(() => MetaService))
    private metaService: MetaService,
    private codeService: CodeService,
    private programService: ProgramService,
    private blockService: BlockService,
    private stateService: StateService,
    private stateToCodeService: StateToCodeService,
  ) {}

  public async connect(): Promise<void> {
    this.connection = await connect(this.configService.get<string>('rabbitmq.url'));
  }

  public async initRMQ(genesis: string): Promise<void> {
    try {
      this.mainChannel = await this.connection.createChannel();
      this.topicChannel = await this.connection.createChannel();

      const directExchange = RabbitMQExchanges.DIRECT_EX;
      const topicExchange = RabbitMQExchanges.TOPIC_EX;
      const directExchangeType = 'direct';
      const routingKey = `ds.${genesis}`;

      //send genesis to api-gateway
      const messageBuff = JSON.stringify({ service: 'ds', action: 'add', genesis });
      this.mainChannel.publish(directExchange, RabbitMQueues.GENESISES, Buffer.from(messageBuff));

      await this.mainChannel.assertExchange(directExchange, directExchangeType);
      await this.topicChannel.assertExchange(topicExchange, 'topic');

      const assertTopicQueue = await this.topicChannel.assertQueue(`dst.${genesis}`, {
        durable: false,
        exclusive: false,
        autoDelete: true
      });

      await this.mainChannel.bindQueue(routingKey, directExchange, routingKey);
      await this.topicChannel.bindQueue(assertTopicQueue.queue, topicExchange, 'ds.genesises');

      await this.directMessageConsumer(routingKey);
      await this.topicMessageConsumer(assertTopicQueue, genesis);

      this.connection.on('close', (error) => {
        console.log(new Date(), error);
        process.exit(1);
      });
    } catch (error) {
      this.logger.error('Init RMQ error');
      this.logger.error(error);
    }
  }

  public sendDeleteGenesis(genesis: string): void {
    const messageBuff = JSON.stringify({ service: 'ds', action: 'delete', genesis });
    this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
  }

  private sendMessage(exchange: RabbitMQExchanges, queue: RabbitMQueues, params: any, correlationId?: string): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(exchange, queue, Buffer.from(messageBuff), { correlationId });
  }

  private async directMessageConsumer(queue: string): Promise<void>{
    try {
      await this.mainChannel.consume(queue, async (message) => {
        if(!message){
          return;
        }
        const method = message.properties.headers.method;

        const params = JSON.parse(message.content.toString());
        const correlationId = message.properties.correlationId;

        const result = await this.handleEventByMethod(method, params);

        this.sendMessage(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES, result, correlationId);
      }, { noAck: true });
    } catch (error) {
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
        this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
      }, { noAck: true });
    } catch (error) {
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
        return this.programService.getProgramMeta(params as GetMetaParams);
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
      [API_METHODS.CODE_META_GET]: () => {
        return this.metaService.getByCodeId(params as GetStateByCodeParams);
      },
      [API_METHODS.CODE_STATE_GET]: () => {
        return this.stateToCodeService.getByCodeIdAndStateId(params as GetStateByCodeParams);
      },
      [API_METHODS.BLOCKS_STATUS]: () => {
        return this.blockService.getLastBlock(params.genesis as string);
      },
      [API_METHODS.PROGRAM_STATE_ADD]: () => {
        return this.stateService.create(params as AddStateParams);
      },
      [API_METHODS.PROGRAM_STATE_GET]: () => {
        return this.stateService.get(params as GetStateParams);
      },
      [API_METHODS.PROGRAM_STATE_ALL]: () => {
        return this.stateService.listByProgramId(params as GetAllStateParams);
      },
    };

    return methods[method]();
  }
}
