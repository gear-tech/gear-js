import { Between, DataSource, FindOptionsWhere, IsNull, MoreThan, Repository } from 'typeorm';
import {
  AllMessagesResult,
  FindMessageParams,
  GetMessagesParams,
  MessageReadReason,
  logger,
  ProgramStatus,
  MessageType,
  MessageNotFound,
} from '@gear-js/common';

import { Message } from '../database';
import { ProgramService } from './program.service';
import { MessagesDispatchedDataInput, MessageEntryPoint, PAGINATION_LIMIT } from '../common';

export class MessageService {
  private repo: Repository<Message>;

  constructor(dataSource: DataSource, private programService: ProgramService) {
    this.repo = dataSource.getRepository(Message);
  }

  public async get({ id, genesis, withMetahash }: FindMessageParams): Promise<Message> {
    const message = await this.repo.findOne({ where: { id, genesis } });

    if (!message) {
      throw new MessageNotFound();
    }

    if (withMetahash) {
      const metahash = await this.programService.getMetahash(
        message.type === MessageType.MSG_SENT ? message.source : message.destination,
        message.genesis,
      );

      Object.assign(message, { metahash });
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
    type,
    withPrograms,
  }: GetMessagesParams): Promise<AllMessagesResult> {
    const commonOptions: FindOptionsWhere<Message> = { genesis };
    let options: FindOptionsWhere<Message>[] | FindOptionsWhere<Message>;

    if (type) {
      commonOptions.type = type;
    }

    if (mailbox) {
      commonOptions.readReason = IsNull();
      commonOptions.expiration = MoreThan(0);
      commonOptions.type = MessageType.MSG_SENT;
    }

    if (fromDate || toDate) {
      commonOptions.timestamp = Between(new Date(fromDate), new Date(toDate));
    }

    if (destination && source) {
      options = [
        { source, ...commonOptions },
        { destination, ...commonOptions },
      ];
    } else {
      if (destination) {
        commonOptions.destination = destination;
      } else if (source) {
        commonOptions.source = source;
      }
      options = commonOptions;
    }

    const [messages, count] = await Promise.all([
      this.repo.find({
        where: options,
        take: Math.min(limit || PAGINATION_LIMIT, 100),
        skip: offset || 0,
        order: { timestamp: 'DESC', type: 'DESC' },
      }),
      this.repo.count({ where: options }),
    ]);

    const result: AllMessagesResult = { messages, count };

    if (withPrograms) {
      const programIds = new Set<string>();

      messages.forEach(({ type, source, destination }) =>
        programIds.add(type === MessageType.MSG_SENT ? source : destination),
      );

      result.programNames = await this.programService.getNames(Array.from(programIds.values()), genesis);
    }

    return result;
  }

  public async save(messages: Message[]) {
    if (messages.length === 0) return;

    await this.repo.save(messages);
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
