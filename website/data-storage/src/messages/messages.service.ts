import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { GearKeyring } from '@gear-js/api';
import { SignNotVerified } from 'src/errors/signature';
import { MessageNotFound } from 'src/errors/message';
import {
  AddPayloadParams,
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  IMessage,
  MessageDispatchedParams,
} from 'src/interfaces';
import { ErrorLogger, getPaginationParams } from 'src/utils';

const logger = new Logger('MessageService');
const errorLog = new ErrorLogger('MessagesService');

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async save(params: IMessage): Promise<Message> {
    const { id, genesis, destination, payload, source, replyError, replyTo, date } = params;
    let message = await this.messageRepo.findOne({ id });
    if (message) {
      if (payload) {
        message.payload = payload;
      }
      if (replyTo) {
        message.replyTo = replyTo;
        message.replyError = replyError;
      }
    } else {
      try {
        message = this.messageRepo.create({
          id,
          genesis,
          destination,
          source,
          payload,
          date: new Date(date),
          replyTo,
          replyError,
        });
      } catch (error) {
        errorLog.error(error, 42);
        return;
      }
    }
    try {
      return await this.messageRepo.save(message);
    } catch (error) {
      errorLog.error(error, 58);
      return;
    }
  }

  async addPayload(params: AddPayloadParams): Promise<Message> {
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
    const [result, total] = await this.messageRepo.findAndCount({
      where: {
        destination: params.destination,
        genesis: params.genesis,
      },
      ...getPaginationParams(params),
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getOutgoing(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [result, total] = await this.messageRepo.findAndCount({
      where: { genesis: params.genesis, source: params.source },
      ...getPaginationParams(params),
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getAllMessages(params: GetMessagesParams): Promise<AllMessagesResult> {
    const where = {
      genesis: params.genesis,
      destination: params.destination,
      source: params.source,
    };
    const [result, total] = await this.messageRepo.findAndCount({
      where,
      ...getPaginationParams(params),
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getMessage(params: FindMessageParams): Promise<Message> {
    const where = {
      genesis: params.genesis,
      id: params.id,
    };
    const result = await this.messageRepo.findOne({ where });
    return result;
  }

  setDispatchedStatus(params: MessageDispatchedParams): Promise<void> {
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
