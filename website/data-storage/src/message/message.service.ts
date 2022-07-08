import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  IMessage,
  IMessagesDispatchedKafkaValue,
  InitStatus,
  IUserMessageSentKafkaValue,
} from '@gear-js/common';

import { Message } from '../database/entities/message.entity';
import { ProgramService } from '../program/program.service';
import { MessageNotFound } from '../common/errors';
import { sleep } from '../utils/sleep';
import { MessageRepo } from './message.repo';

@Injectable()
export class MessageService {
  private logger: Logger = new Logger('MessageService');

  constructor(private messageRepository: MessageRepo, private readonly programService: ProgramService) {}

  public async createMessage({ timestamp, ...params }: IUserMessageSentKafkaValue): Promise<IMessage> {
    try {
      const messageTypeDB = plainToClass(Message, {
        ...params,
        timestamp: new Date(timestamp),
      });

      if (params.replyToMessageId) {
        const { entry } = await this.messageRepository.get(params.replyToMessageId);
        messageTypeDB.entry = entry;
      }

      return this.messageRepository.save(messageTypeDB);
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  public async getAllMessages(params: GetMessagesParams): Promise<AllMessagesResult> {
    const [messages, total] = await this.messageRepository.listByIdAndSourceAndDestination(params);
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

  public async setDispatchedStatus({ statuses, genesis }: IMessagesDispatchedKafkaValue): Promise<void> {
    await sleep(1000);
    for (const messageId of Object.keys(statuses)) {
      try {
        await this.messageRepository.updateMessage(
          { id: messageId, genesis },
          { processedWithPanic: statuses[messageId] === 'Success' ? false : true },
        );
      } catch (error) {
        this.logger.error(error.message, error.stack);
      }

      if (statuses[messageId] === 'Failed') {
        const message = await this.messageRepository.get(messageId);
        if (message.entry === 'Init') {
          this.programService.setStatus(message.destination, genesis, InitStatus.FAILED);
        }
      }
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    const messages = await this.messageRepository.listByGenesis(genesis);
    await this.messageRepository.remove(messages);
  }
}
