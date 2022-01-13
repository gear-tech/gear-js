import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { GearKeyring } from '@gear-js/api';
import { SignNotVerified } from 'src/errors/signature';
import { MessageNotFound } from 'src/errors/message';
import { AddPayloadParams, AllMessagesResult, FindMessageParams, GetMessagesParams } from 'src/interfaces';
import { PAGINATION_LIMIT } from 'src/config/configuration';
import { ErrorLogger } from 'src/utils';

const logger = new Logger('MessageService');
const errorLog = new ErrorLogger('MessagesService');

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async save({ id, genesis, destination, source, payload, date, replyTo, replyError }): Promise<Message> {
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
        });
      } catch (error) {
        errorLog.error(error, 33);
        return;
      }
    }
    try {
      return this.messageRepo.save(message);
    } catch (error) {
      errorLog.error(error, 48);
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
      take: params.limit || PAGINATION_LIMIT,
      skip: params.offset || 0,
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getOutgoing(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [result, total] = await this.messageRepo.findAndCount({
      where: { genesis: params.genesis, source: params.source },
      take: params.limit || PAGINATION_LIMIT,
      skip: params.offset || 0,
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
    console.log(where);
    const [result, total] = await this.messageRepo.findAndCount({
      where,
      take: params.limit | PAGINATION_LIMIT,
      skip: params.offset | 0,
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getMessage(params: FindMessageParams): Promise<Message> {
    const where = {
      id: params.id,
    };
    const result = await this.messageRepo.findOne({ where });
    return result;
  }
}
