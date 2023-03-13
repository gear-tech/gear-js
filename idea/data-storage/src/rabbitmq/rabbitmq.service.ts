import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, connect, Connection } from 'amqplib';
import {
  AddMetaByCodeParams,
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
  GetMetaByCodeParams,
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
import { RabbitmqMessageParams } from '../common/types';
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

  public async initRMQ(): Promise<void> {
    try {
      this.mainChannel = await this.connection.createChannel();
      this.topicChannel = await this.connection.createChannel();

      const directExchange = RabbitMQExchanges.DIRECT_EX;
      const topicExchange = RabbitMQExchanges.TOPIC_EX;
      const directExchangeType = 'direct';

      await this.mainChannel.assertExchange(directExchange, directExchangeType);
      await this.topicChannel.assertExchange(topicExchange, 'topic');

      this.connection.on('close', (error) => {
        console.log(new Date(), error);
        process.exit(1);
      });
    } catch (error) {
      this.logger.error('Init RMQ error');
      this.logger.error(error);
    }
  }

  public async deleteGenesisQueue(genesis: string) {
    const routingKey = `ds.${genesis}`;
    const messageBuff = JSON.stringify({ service: 'ds', action: 'delete', genesis });
    await this.mainChannel.unbindQueue(routingKey, RabbitMQExchanges.DIRECT_EX, routingKey);
    this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
  }

  public async addGenesisQueue(genesis: string) {
    const genesisQ = `ds.${genesis}`;
    await this.topicChannel.assertQueue(genesisQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });

    const topicQ = `dst.${genesis}`;
    await this.topicChannel.assertQueue(topicQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });
    await this.mainChannel.bindQueue(genesisQ, RabbitMQExchanges.DIRECT_EX, genesisQ);
    await this.topicChannel.bindQueue(topicQ, RabbitMQExchanges.TOPIC_EX, 'ds.genesises');
    await this.directMsgConsumer(genesisQ);
    await this.topicMsgConsumer(topicQ, genesis);

    const msgBuff = JSON.stringify({ service: 'ds', action: 'add', genesis });
    this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(msgBuff));
  }

  private sendMsg(exchange: RabbitMQExchanges, queue: RabbitMQueues, params: any, correlationId?: string): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(exchange, queue, Buffer.from(messageBuff), { correlationId });
  }

  private async directMsgConsumer(queue: string): Promise<void> {
    try {
      await this.mainChannel.consume(
        queue,
        async (message) => {
          if (!message) {
            return;
          }
          const method = message.properties.headers.method;

          const params = JSON.parse(message.content.toString());
          const correlationId = message.properties.correlationId;

          const result = await this.handleIncomingMsg(method, params);

          this.sendMsg(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES, result, correlationId);
        },
        { noAck: true },
      );
    } catch (error) {
      this.logger.error(`Direct exchange consumer ${JSON.stringify(error)}`);
    }
  }

  private async topicMsgConsumer(repliesAssertQueue: string, genesis): Promise<void> {
    try {
      await this.topicChannel.consume(
        repliesAssertQueue,
        async (message) => {
          if (!message) {
            return;
          }

          const messageBuff = JSON.stringify({ service: 'ds', action: 'add', genesis });
          this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
        },
        { noAck: true },
      );
    } catch (error) {
      this.logger.error(`Topic exchange consumer ${JSON.stringify(error)}`);
    }
  }

  @FormResponse
  private async handleIncomingMsg(method: string, params: RabbitmqMessageParams): Promise<any> {
    const methods = {
      [API_METHODS.PROGRAM_DATA]: () => this.programService.findProgram(params as FindProgramParams),
      [API_METHODS.PROGRAM_ALL]: () => this.programService.getAllPrograms(params as GetAllProgramsParams),
      [API_METHODS.PROGRAM_META_ADD]: () => this.metaService.addMetaByProgram(params as AddMetaParams),
      [API_METHODS.PROGRAM_META_GET]: () => this.programService.getProgramMeta(params as GetMetaParams),
      [API_METHODS.MESSAGE_ALL]: () => this.messageService.getAllMessages(params as GetMessagesParams),
      [API_METHODS.MESSAGE_DATA]: () => this.messageService.getMessage(params as FindMessageParams),
      [API_METHODS.CODE_ALL]: () => this.codeService.getAllCode(params as GetAllCodeParams),
      [API_METHODS.CODE_DATA]: () => this.codeService.getByIdAndGenesis(params as GetCodeParams),
      [API_METHODS.CODE_META_GET]: () => this.codeService.getMeta(params as GetMetaByCodeParams),
      [API_METHODS.CODE_META_ADD]: () => this.metaService.addMetaByCode(params as AddMetaByCodeParams),
      [API_METHODS.CODE_STATE_GET]: () => this.stateToCodeService.getByCodeIdAndStateId(params as GetStateByCodeParams),
      [API_METHODS.BLOCKS_STATUS]: () => this.blockService.getLastBlock(params.genesis as string),
      [API_METHODS.PROGRAM_STATE_ADD]: () => this.stateService.create(params as AddStateParams),
      [API_METHODS.PROGRAM_STATE_GET]: () => this.stateService.get(params as GetStateParams),
      [API_METHODS.PROGRAM_STATE_ALL]: () => this.stateService.listByProgramId(params as GetAllStateParams),
    };

    return methods[method]();
  }
}
