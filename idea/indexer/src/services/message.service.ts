import { DataSource, Repository } from 'typeorm';
import {
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  MessageReadReason,
  logger,
  ProgramStatus,
} from '@gear-js/common';

import { Message } from '../database';
import { ProgramService } from './program.service';
import {
  MessagesDispatchedDataInput,
  MessageEntryPoint,
  MessageNotFound,
  PAGINATION_LIMIT,
  getDatesFilter,
} from '../common';

export class MessageService {
  private repo: Repository<Message>;

  constructor(dataSource: DataSource, private programService: ProgramService) {
    this.repo = dataSource.getRepository(Message);
  }

  public async get({ id, genesis }: FindMessageParams): Promise<Message> {
    const message = await this.repo.findOne({ where: { id, genesis }, relations: ['program'] });
    if (!message) {
      throw new MessageNotFound();
    }
    return message;
  }

  public async getMany({
    genesis,
    source,
    destination,
    limit,
    offset,
    toDate,
    fromDate,
    mailbox,
  }: GetMessagesParams): Promise<AllMessagesResult> {
    const builder = this.repo
      .createQueryBuilder('message')
      .leftJoin('message.program', 'program')
      .addSelect(['program.id', 'program.name'])
      .where({ genesis });

    if (mailbox) {
      builder.andWhere('message.readReason = :readReason', { readReason: null });
      builder.andWhere('message.expiration > :expiration', { expiration: 0 });
    }

    if (fromDate || toDate) {
      const parameters = getDatesFilter(fromDate, toDate);
      builder.andWhere('message.timestamp BETWEEN :fromDate AND :toDate', parameters);
    }

    if (destination && source) {
      builder.andWhere('(message.destination = :destination OR message.source = :source)', { destination, source });
    } else if (destination) {
      builder.andWhere('message.destination = :destination', { destination });
    } else if (source) {
      builder.andWhere('message.destination = :source', { source });
    }

    const [messages, count] = await Promise.all([
      builder
        .take(limit || PAGINATION_LIMIT)
        .skip(offset || 0)
        .orderBy('message.timestamp', 'DESC')
        .getMany(),
      builder.getCount(),
    ]);

    return {
      messages,
      count,
    };
  }

  public save(messages: Message[]): Promise<Message[]> {
    return this.repo.save(messages);
  }

  public async setDispatchedStatus({ statuses, genesis }: MessagesDispatchedDataInput): Promise<void> {
    for (const id of Object.keys(statuses)) {
      try {
        await this.repo.update({ id, genesis }, { processedWithPanic: statuses[id] === 'Success' ? false : true });
      } catch (error) {
        logger.error(error.message, { error });
      }

      if (statuses[id] === 'Failed') {
        const message = await this.get({ id, genesis });
        if (message.entry === MessageEntryPoint.INIT) {
          await this.programService.setStatus(message.destination, genesis, ProgramStatus.TERMINATED);
        }
      }
    }
  }

  public async updateReadStatus(id: string, readReason: MessageReadReason): Promise<void> {
    try {
      await this.repo.update({ id }, { readReason });
    } catch (error) {
      logger.error(error.message, { error });
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    await this.repo.delete({ genesis });
  }
}
