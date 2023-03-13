import { Injectable, Logger } from '@nestjs/common';
import {
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  IMessage,
  MessageReadReason,
  ProgramStatus,
} from '@gear-js/common';

import { Message } from '../database/entities';
import { ProgramService } from '../program/program.service';
import { MessageRepo } from './message.repo';
import { MessageNotFound } from '../common/errors';
import { MessageEntryPoint } from '../common/enums';
import { MessagesDispatchedDataInput } from '../common/types';

@Injectable()
export class MessageService {
  private logger: Logger = new Logger(MessageService.name);

  constructor(private messageRepository: MessageRepo, private programService: ProgramService) {}

  public async getAllMessages(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [messages, total] = await this.messageRepository.list(params);
    return {
      messages,
      count: total,
    };
  }

  public async getMessage(params: FindMessageParams): Promise<IMessage> {
    const { id, genesis } = params;
    const message = await this.messageRepository.getByIdAndGenesis(id, genesis);
    if (!message) {
      throw new MessageNotFound();
    }
    return message;
  }

  public async createMessages(messages: Message[]): Promise<IMessage[]> {
    for (const m of messages) {
      if (m.replyToMessageId) {
        const replyTo = await this.messageRepository.getByIdAndGenesis(m.replyToMessageId, m.genesis);
        m.entry = replyTo.entry;
      }
    }
    try {
      return this.messageRepository.save(messages);
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  public async setDispatchedStatus({ statuses, genesis }: MessagesDispatchedDataInput): Promise<void> {
    for (const messageId of Object.keys(statuses)) {
      try {
        await this.messageRepository.update(
          { id: messageId, genesis },
          { processedWithPanic: statuses[messageId] === 'Success' ? false : true },
        );
      } catch (error) {
        this.logger.error(error.message, error.stack);
      }

      if (statuses[messageId] === 'Failed') {
        const message = await this.messageRepository.get(messageId, genesis);
        if (message.entry === MessageEntryPoint.INIT) {
          await this.programService.setStatus(message.destination, genesis, ProgramStatus.TERMINATED);
        }
      }
    }
  }

  public async updateReadStatus(id: string, readReason: MessageReadReason): Promise<void> {
    try {
      await this.messageRepository.update({ id }, { readReason });
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    const messages = await this.messageRepository.listByGenesis(genesis);
    await this.messageRepository.remove(messages);
  }
}
