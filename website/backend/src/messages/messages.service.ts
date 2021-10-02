import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessageNotFound } from 'src/json-rpc/errors';
import { GearKeyring } from '@gear-js/api';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async save(info: {
    id: string;
    destination: string;
    program: string;
    date: Date;
    response?: string;
    responseId?: string;
  }): Promise<Message> {
    const createdMessage = this.messageRepo.create(info);
    return this.messageRepo.save(createdMessage);
  }

  async update(messageId: string, info: { responseId: string; response: string }): Promise<Message> {
    const savedMessage = await this.findOne(messageId);
    savedMessage.responseId = info.responseId;
    savedMessage.response = info.response;
    const s = await this.messageRepo.save(savedMessage);
    return s;
  }

  async saveSendedPayload(messageId: string, payload: string, signature: string) {
    const message = await this.findOne(messageId);
    if (!message) {
      return { status: 'Message not found' };
    }
    if (!GearKeyring.checkSign(message.destination, signature, payload)) {
      return { status: 'Signature not verified' };
    } else {
      let message = await this.findOne(messageId);
      if (message) {
        message.payload = payload;
        return this.messageRepo.save(message);
      }
      return null;
    }
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepo.findOne(id);
    if (!message) {
      return null;
    }
    return message;
  }

  async markAsRead(destination: string, id: string): Promise<Message> {
    const message = await this.messageRepo.findOne({ id, destination });
    if (message) {
      message.isRead = true;
      return await this.messageRepo.save(message);
    } else {
      throw new MessageNotFound();
    }
  }

  async getAll(
    destination: string,
    isRead?: boolean,
    programId?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Message[], number]> {
    const where = { destination };
    if (isRead) {
      where['isRead'] = isRead;
    }
    if (programId) {
      where['program'] = programId;
    }
    const messages = await this.messageRepo.findAndCount({
      where,
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
