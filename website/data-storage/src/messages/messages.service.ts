import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { GearKeyring } from '@gear-js/api';
import { SignNotVerified } from 'src/errors/signature';
import { MessageNotFound } from 'src/errors/message';
import { AddPayloadParams, AllMessagesResult, GetMessagesParams } from 'src/interfaces';

const logger = new Logger('MessageService');
@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async save({
    id,
    chain,
    genesis,
    destination,
    source,
    payload,
    date,
    replyTo,
    replyError,
    isRead,
  }): Promise<Message> {
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
      message = this.messageRepo.create({
        id,
        chain,
        genesis,
        destination,
        source,
        payload,
        date: new Date(date),
        isRead,
        replyTo,
      });
    }
    return this.messageRepo.save(message);
  }

  async addPayload(params: AddPayloadParams): Promise<Message> {
    const { id, chain, genesis, signature, payload } = params;
    const message = await this.messageRepo.findOne({ id, genesis, chain });
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
      where: { chain: params.chain, destination: params.destination, genesis: params.genesis, isRead: params.isRead },
      take: params.limit | 20,
      skip: params.offset | 0,
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getOutgoing(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [result, total] = await this.messageRepo.findAndCount({
      where: { genesis: params.genesis, chain: params.chain, source: params.source },
      take: params.limit | 20,
      skip: params.offset | 0,
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getAllMessages(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [result, total] = await this.messageRepo.findAndCount({
      where: {
        genesis: params.genesis,
        chain: params.chain,
        destination: params.destination,
        source: params.source,
        isRead: params.isRead,
      },
      take: params.limit | 20,
      skip: params.offset | 0,
    });
    return {
      messages: result,
      count: total,
    };
  }

  async getCountUnread(destination: string): Promise<number> {
    const messages = await this.messageRepo.findAndCount({
      destination,
      isRead: false,
    });
    return messages[1];
  }
}
