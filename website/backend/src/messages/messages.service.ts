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

  async save(message: LogMessage): Promise<Message> {
    const createdMessage = this.messageRepo.create({
      ...message,
    });
    return this.messageRepo.save(createdMessage);
  }

  async update(message: LogMessage): Promise<Message> {
    const savedMessage = await this.findOne(message.id);
    if (!savedMessage) {
      return await this.save(message);
    }
    savedMessage.responseId = message.responseId;
    savedMessage.response =
      isJsonObject(message.response) && !isString(message.response)
        ? JSON.stringify(message.response)
        : message.response;
    const s = await this.messageRepo.save(savedMessage);
    console.log(s);
    return s;
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepo.findOne(id);
    if (!message) {
      return null;
    }
    return message;
  }

  async markAsRead(user: User, id: string): Promise<Message> {
    const message = await this.messageRepo.findOne({ id, destination: user });
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

  async getCountUnread(user: User): Promise<number> {
    const messages = await this.messageRepo.findAndCount({
      destination: user,
      isRead: false,
    });
    return messages[1];
  }
}
