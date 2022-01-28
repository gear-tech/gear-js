import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { GearKeyring } from '@gear-js/api';
import { SignNotVerified } from 'src/errors/signature';
import { MessageNotFound } from 'src/errors/message';
import {
  AddPayloadParams,
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  IMessage,
  MessageDispatched,
} from '@gear-js/interfaces';
import { ErrorLogger, getPaginationParams } from 'src/utils';

/** Add backslashes before special characters in SQL `LIKE` clause. */
const escapeSqlLike = (x: string) => x.replace('%', '\\%').replace('_', '\\_');

const logger = new Logger('MessageService');
const errorLog = new ErrorLogger('MessagesService');

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
      errorLog.error(error, 42);
      return;
    }
  }

  async addPayload(params: AddPayloadParams): Promise<IMessage> {
    const { id, genesis, signature, payload } = params;
    const message = await this.messageRepo.findOne({ id, genesis });
    if (!message) {
      throw new MessageNotFound();
    }
    if (!GearKeyring.checkSign(message.source, signature, payload)) {
      throw new SignNotVerified();
    }
    message.payload = payload;
    return this.messageRepo.save(message);
  }

  async getIncoming(params: GetMessagesParams): Promise<AllMessagesResult> {
    const { genesis, destination, term } = params;
    const likeTerm = ILike(`%${escapeSqlLike(term || '')}%`);
    const strictParamsIfPresent = { genesis, destination };
    const where = [
      {
        id: likeTerm,
        ...strictParamsIfPresent,
      },
    ];
    const [result, total] = await this.messageRepo.findAndCount({
      where,
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
    const { genesis, source, term } = params;
    const likeTerm = ILike(`%${escapeSqlLike(term || '')}%`);
    const strictParamsIfPresent = { genesis, source };
    const where = [
      {
        id: likeTerm,
        ...strictParamsIfPresent,
      },
    ];
    const [result, total] = await this.messageRepo.findAndCount({
      where,
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
    const { genesis, source, destination, term } = params;
    const likeTerm = term != null ? ILike(`%${escapeSqlLike(term)}%`) : void null;
    const strictParamsIfPresent = { genesis, source, destination };
    const where = [
      {
        id: likeTerm,
        ...strictParamsIfPresent,
      },
    ];
    const [result, total] = await this.messageRepo.findAndCount({
      where,
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
    return result;
  }

  setDispatchedStatus(params: MessageDispatched): Promise<void> {
    const error = params.outcome !== 'success' ? params.outcome : null;
    if (error === null) {
      return;
    }
    setTimeout(async () => {
      const message = await this.messageRepo.findOne({
        genesis: params.genesis,
        id: params.messageId,
      });
      if (message) {
        message.error = error;
      }
      this.messageRepo.save(message);
      const logMessages = await this.messageRepo.find({
        genesis: params.genesis,
        replyTo: params.messageId,
        replyError: '1',
      });
      if (logMessages.length > 0) {
        logMessages.forEach((log) => {
          log.replyError = error;
          this.messageRepo.save(log);
        });
      }
    }, 1000);
  }
}
