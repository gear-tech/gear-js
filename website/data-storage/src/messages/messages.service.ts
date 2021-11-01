import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { GearKeyring } from '@gear-js/api';
import { SignNotVerified } from 'src/errors/signature';
import { MessageNotFound } from 'src/errors/message';
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

  async addPayload(
    id: string,
    chain: string,
    payload: string,
    signature: string,
  ) {
    const message = await this.messageRepo.findOne({ id, chain });
    if (!message) {
      throw new MessageNotFound();
    }
    if (!GearKeyring.checkSign(message.source, signature, payload)) {
      throw new SignNotVerified();
    }
    message.payload = payload;
    return this.messageRepo.save(message);
  }

  async getIncoming(
    chain: string,
    destination?: string,
    isRead?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<[Message[], number]> {
    const messages = await this.messageRepo.findAndCount({
      where: { chain, destination, isRead },
      take: limit | 20,
      skip: offset | 0,
    });
    return messages;
  }

  async getOutgoing(
    chain: string,
    source?: string,
    limit?: number,
    offset?: number,
  ) {
    const messages = await this.messageRepo.findAndCount({
      where: { chain, source },
      take: limit | 20,
      skip: offset | 0,
    });
    return messages;
  }

  async getCountUnread(destination: string): Promise<number> {
    const messages = await this.messageRepo.findAndCount({
      destination,
      isRead: false,
    });
    return messages[1];
  }
}
