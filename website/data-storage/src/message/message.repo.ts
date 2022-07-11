import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMessagesParams } from '@gear-js/common';

import { Message } from '../database/entities';
import { PAGINATION_LIMIT } from '../config/configuration';
import { sqlWhereWithILike } from '../utils/sql-where-with-ilike';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MessageRepo {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  public async save(message: Message): Promise<Message> {
    return this.messageRepo.save(message);
  }

  public async listByIdAndSourceAndDestination(params: GetMessagesParams): Promise<[Message[], number]> {
    const { genesis, source, query, destination, limit, offset } = params;
    const strictParams = { genesis };
    if (source) {
      strictParams['source'] = source;
    }
    if (destination) {
      strictParams['destination'] = destination;
    }
    return this.messageRepo.findAndCount({
      where: sqlWhereWithILike(strictParams, query, ['id', 'source', 'destination']),
      take: limit || PAGINATION_LIMIT,
      skip: offset || 0,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  public async getByIdAndGenesis(id: string, genesis: string): Promise<Message> {
    return this.messageRepo.findOne({
      where: {
        id,
        genesis,
      },
    });
  }

  public async get(id: string): Promise<Message> {
    return this.messageRepo.findOne({
      where: { id },
    });
  }

  public async listByGenesis(genesis: string): Promise<Message[]> {
    return this.messageRepo.find({
      where: {
        genesis,
      },
    });
  }

  public async remove(messages: Message[]): Promise<Message[]> {
    return this.messageRepo.remove(messages);
  }

  public async updateMessage(where: FindOptionsWhere<Message>, partialEntity: QueryDeepPartialEntity<Message>) {
    return this.messageRepo.update(where, partialEntity);
  }
}
