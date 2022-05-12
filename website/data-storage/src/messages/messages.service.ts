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
  MessageDispatched,
} from '@gear-js/interfaces';

const logger = new Logger('MessageService');

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async save(params: IMessage): Promise<IMessage> {
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

  async setDispatchedStatus(params: MessageDispatched): Promise<void> {
    const error = params.outcome !== 'success' ? params.outcome : null;
    if (error === null) {
      return;
    }
    await sleep(1000);
    const message = await this.messageRepo.findOne({
      where: { genesis: params.genesis, id: params.messageId },
    });
    if (message) {
      message.error = error;
      this.messageRepo.save(message);
    }
    const logMessages = await this.messageRepo.find({
      where: { genesis: params.genesis, replyTo: params.messageId, replyError: '1' },
    });
    if (logMessages.length > 0) {
      logMessages.forEach((log) => {
        log.replyError = error;
        this.messageRepo.save(log);
      });
    }
  }

  async deleteRecords(genesis: string): Promise<void> {
    const messages = await this.messageRepo.find({ where: { genesis } });
    this.messageRepo.remove(messages);
  }
}
