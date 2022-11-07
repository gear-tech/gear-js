import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMessagesParams } from '@gear-js/common';

import { Message } from '../database/entities';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PAGINATION_LIMIT } from '../common/constants';
import { constructQueryBuilder } from '../common/helpers';

@Injectable()
export class MessageRepo {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  public async list(params: GetMessagesParams): Promise<[Message[], number]> {
    const { genesis, source, query, destination, limit, offset, toDate, fromDate, mailbox } = params;

    const builder = constructQueryBuilder(
      this.messageRepo,
      genesis,
      {
        source,
        destination,
        readReason: mailbox ? null : undefined,
        expiration: mailbox ? { operator: '>', value: 0 } : undefined,
      },
      { fields: ['id', 'source', 'destination'], value: query },
      { fromDate, toDate },
      offset || 0,
      limit || PAGINATION_LIMIT,
      ['program'],
      [
        { column: 'timestamp', sort: 'DESC' },
        { column: 'type', sort: 'ASC' },
      ],
    );

    return builder.getManyAndCount();
  }

  public async getByIdAndGenesis(id: string, genesis: string): Promise<Message> {
    return this.messageRepo.findOne({
      where: {
        id,
        genesis,
      },
      relations: ['program'],
    });
  }

  public async get(id: string, genesis: string): Promise<Message> {
    return this.messageRepo.findOne({
      where: { id, genesis },
    });
  }

  public async listByGenesis(genesis: string): Promise<Message[]> {
    return this.messageRepo.find({
      where: {
        genesis,
      },
    });
  }

  public async save(messages: Message[]): Promise<Message[]> {
    return this.messageRepo.save(messages);
  }

  public async remove(messages: Message[]): Promise<Message[]> {
    return this.messageRepo.remove(messages);
  }

  public async update(
    where: FindOptionsWhere<Message>,
    partialEntity: QueryDeepPartialEntity<Message>,
  ): Promise<UpdateResult> {
    return this.messageRepo.update(where, partialEntity);
  }
}
