import { DataSource, MoreThan, Repository } from 'typeorm';
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
    const readReason = mailbox ? null : undefined;
    const expiration = mailbox ? MoreThan(0) : undefined;

    const commonWhere = { genesis, readReason, expiration, timestamp: getDatesFilter(fromDate, toDate) };
    const orWhere = [];

    if (destination) {
      orWhere.push({ destination, ...commonWhere });
    }
    if (source) {
      orWhere.push({ source, ...commonWhere });
    }

    const where = orWhere.length > 0 ? orWhere : commonWhere;

    const [messages, count] = await Promise.all([
      this.repo.find({
        where,
        take: limit || PAGINATION_LIMIT,
        skip: offset || 0,
        relations: ['program'],
        select: { program: { id: true, name: true } },
        order: { timestamp: 'DESC', type: 'DESC' },
      }),
      this.repo.count({ where }),
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
