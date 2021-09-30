import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ProgramsService } from 'src/programs/programs.service';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { LogMessage } from './interface';
import { isJsonObject, isString } from '@polkadot/util';
import { MessageNotFound } from 'src/json-rpc/errors';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly programService: ProgramsService,
  ) {}

  async save(info: {
    id: string;
    destination: string;
    program: string;
    date: Date;
    payload?: string;
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
    user: User,
    isRead?: boolean,
    programId?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Message[], number]> {
    const where = { destination: user };
    if (isRead) {
      where['isRead'] = isRead;
    }
    if (programId) {
      const program = await this.programService.findProgram(programId);
      if (!program) {
        return [[], 0];
      }
      where['program'] = program;
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
