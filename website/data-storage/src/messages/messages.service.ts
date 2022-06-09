import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GearKeyring } from '@gear-js/api';
import { Message } from '../entities/message.entity';
import { MessageNotFound, SignatureNotVerified } from '../errors';
import { getPaginationParams, getWhere, sleep } from '../utils';
import {
  AddPayloadParams,
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  IMessage,
  IMessagesDispatchedKafkaValue,
  IUserMessageSentKafkaValue,
} from '@gear-js/interfaces';

const logger = new Logger('MessageService');

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async save(params: IUserMessageSentKafkaValue): Promise<IMessage> {
    const { id, genesis, destination, payload, source, replyError, replyTo, timestamp, blockHash } = params;
    try {
      const message = this.messageRepo.create({
        id,
        genesis,
        destination,
        source,
        payload,
        replyTo,
        replyError,
        timestamp: new Date(timestamp),
        blockHash,
      });
      return await this.messageRepo.save(message);
    } catch (error) {
      logger.error(error, error.stack);
      return;
    }
  }

  async addPayload(params: AddPayloadParams): Promise<IMessage> {
    const { id, genesis, signature, payload } = params;
    const message = await this.messageRepo.findOne({ where: { id, genesis } });
    if (!message) {
      throw new MessageNotFound();
    }
    if (!GearKeyring.checkSign(message.source, signature, payload)) {
      throw new SignatureNotVerified();
    }
    message.payload = payload;
    return this.messageRepo.save(message);
  }

  async getIncoming(params: GetMessagesParams): Promise<AllMessagesResult> {
    const { genesis, destination, query } = params;
    const [result, total] = await this.messageRepo.findAndCount({
      where: getWhere({ genesis, destination }, query, ['id', 'source']),
      ...getPaginationParams(params),
      order: {
        timestamp: 'DESC',
      },
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getOutgoing(params: GetMessagesParams): Promise<AllMessagesResult> {
    const { genesis, source, query } = params;
    const [result, total] = await this.messageRepo.findAndCount({
      where: getWhere({ genesis, source }, query, ['id', 'destination']),
      ...getPaginationParams(params),
      order: {
        timestamp: 'DESC',
      },
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getAllMessages(params: GetMessagesParams): Promise<AllMessagesResult> {
    const { genesis, source, destination, query } = params;
    const strictParams = { genesis };
    if (source) {
      strictParams['source'] = source;
    }
    if (destination) {
      strictParams['destination'] = destination;
    }
    const [result, total] = await this.messageRepo.findAndCount({
      where: getWhere(strictParams, query, ['id', 'source', 'destination']),
      ...getPaginationParams(params),
      order: {
        timestamp: 'DESC',
      },
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getMessage(params: FindMessageParams): Promise<IMessage> {
    const where = {
      genesis: params.genesis,
      id: params.id,
    };
    const result = await this.messageRepo.findOne({ where });
    if (!result) {
      throw new MessageNotFound();
    }
    return result;
  }

  async setDispatchedStatus({ statuses, genesis }: IMessagesDispatchedKafkaValue): Promise<void> {
    for (let messageId of Object.keys(statuses)) {
      if (statuses[messageId] === 'Success') continue;

      await sleep(100);
      await this.messageRepo.update({ genesis, id: messageId }, { processedWithPanic: true });
    }
  }

  async deleteRecords(genesis: string): Promise<void> {
    const messages = await this.messageRepo.find({ where: { genesis } });
    this.messageRepo.remove(messages);
  }
}
