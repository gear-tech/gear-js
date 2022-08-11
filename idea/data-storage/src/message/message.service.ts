import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  IMessage,
  IMessagesDispatchedKafkaValue,
  InitStatus,
  MESSAGE_READ_STATUS,
  UpdateMessageData,
} from '@gear-js/common';

import { Message } from '../database/entities/message.entity';
import { ProgramService } from '../program/program.service';
import { MessageNotFound } from '../common/errors';
import { sleep } from '../utils/sleep';
import { MessageRepo } from './message.repo';
import { CreateMessageInput } from './types';

@Injectable()
export class MessageService {
  private logger: Logger = new Logger('MessageService');

  constructor(private messageRepository: MessageRepo, private programService: ProgramService) {}

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

  public async createMessage({ timestamp, ...params }: CreateMessageInput): Promise<IMessage> {
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

  public async setDispatchedStatus({ statuses, genesis }: IMessagesDispatchedKafkaValue): Promise<void> {
    await sleep(1000);
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
        const message = await this.messageRepository.get(messageId);
        if (message.entry === 'Init') {
          this.programService.setStatus(message.destination, genesis, InitStatus.FAILED);
        }
      }
    }
  }

  public async updateMessagesData(updateMessagesParams: UpdateMessageData[]): Promise<void> {
    const promises = updateMessagesParams.map((updateMessageData) => {
      return this.updateMessage(updateMessageData);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async updateReadStatus(id: string, readStatus: MESSAGE_READ_STATUS): Promise<void> {
    try {
      await this.messageRepository.update({ id }, { readStatus });
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    const messages = await this.messageRepository.listByGenesis(genesis);
    await this.messageRepository.remove(messages);
  }

  private async updateMessage(updateMessageData: UpdateMessageData): Promise<void> {
    const { messageId, genesis, ...data } = updateMessageData;
    await this.messageRepository.update({ id: messageId, genesis }, { ...data });
  }
}
