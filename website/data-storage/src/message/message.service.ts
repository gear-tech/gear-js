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

import { Message } from '../entities/message.entity';
import { ProgramService } from '../program/program.service';
import { MessageNotFound } from '../errors';
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
        const messageThatReplied = await this.messageRepository.get(params.replyToMessageId);
        messageTypeDB.entry = messageThatReplied.entry;
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
        await this.messageRepository.updateMessagePanicStatus(
          messageId,
          genesis,
          statuses[messageId] === 'Success' ? false : true,
        );
      } catch (error) {
        this.logger.error(error.message, error.stack);
      }

      if (statuses[messageId] === 'Failure') {
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
