import { Injectable, Logger } from '@nestjs/common';
import { GearKeyring } from '@gear-js/api';
import { plainToClass } from 'class-transformer';
import {
  AddPayloadParams,
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  IMessage,
  IMessagesDispatchedKafkaValue,
  IUserMessageSentKafkaValue,
} from '@gear-js/common';

import { Message } from '../entities/message.entity';
import { MessageNotFound, SignatureNotVerified } from '../errors';
import { sleep } from '../utils';
import { MessageRepo } from './message.repo';

@Injectable()
export class MessageService {
  private logger: Logger = new Logger('MessageService');
  constructor(private messageRepository: MessageRepo) {}
  public async createMessage(params: IUserMessageSentKafkaValue): Promise<IMessage> {
    try {
      const messageTypeDB = plainToClass(Message, {
        ...params,
        timestamp: new Date(params.timestamp),
      });

      return this.messageRepository.save(messageTypeDB);
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  public async addPayload(params: AddPayloadParams): Promise<IMessage> {
    const { id, genesis, signature, payload } = params;
    const message = await this.messageRepository.getByIdAndGenesis(id, genesis);
    if (!message) {
      throw new MessageNotFound();
    }
    if (!this.isTestMode()) {
      if (!GearKeyring.checkSign(message.source, signature, payload)) {
        throw new SignatureNotVerified();
      }
    }

    message.payload = payload;
    return this.messageRepository.save(message);
  }

  public async getIncoming(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [messages, total] = await this.messageRepository.listByIdAndSource(params);
    return {
      messages,
      count: total,
    };
  }

  public async getOutgoing(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [messages, total] = await this.messageRepository.listByIdAndDestination(params);
    return {
      messages,
      count: total,
    };
  }

  public async getAllMessages(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [messages, total] = await this.messageRepository.listByIdAndSourceAndDestination(params);
    return {
      messages,
      count: total,
    };
  }

  public async getMessage(params: FindMessageParams): Promise<IMessage> {
    const { id, genesis } = params;
    const message = await this.messageRepository.getByIdAndGenesis(id, genesis);
    if (!message) {
      throw new MessageNotFound();
    }
    return message;
  }

  public async setDispatchedStatus({ statuses, genesis }: IMessagesDispatchedKafkaValue): Promise<void> {
    for (const messageId of Object.keys(statuses)) {
      if (statuses[messageId] === 'Success') continue;

      await sleep(100);
      const message = await this.messageRepository.getByIdAndGenesis(messageId, genesis);
      message.processedWithPanic = true;
      await this.messageRepository.save(message);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    const messages = await this.messageRepository.listByGenesis(genesis);
    await this.messageRepository.remove(messages);
  }

  private isTestMode(): boolean {
    return process.env.TEST_ENV ? true : false;
  }
}
