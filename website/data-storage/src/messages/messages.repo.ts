import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMessagesParams } from '@gear-js/common';

import { Message } from '../entities';
import { getWhere } from '../utils';
import { PAGINATION_LIMIT } from '../config/configuration';

@Injectable()
export class MessagesRepo {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  public async save(message: Message): Promise<Message> {
    return this.messageRepo.save(message);
  }

  public async getByIdAndSource(params: GetMessagesParams): Promise<[Message[], number]> {
    const { genesis, destination, query } = params;
    return this.messageRepo.findAndCount({
      where: getWhere({ genesis, destination }, query, ['id', 'source']),
      take: params.limit || PAGINATION_LIMIT,
      skip: params.offset || 0,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  public async getByIdAndDestination(params: GetMessagesParams): Promise<[Message[], number]> {
    const { genesis, source, query } = params;
    return this.messageRepo.findAndCount({
      where: getWhere({ genesis, source }, query, ['id', 'destination']),
      take: params.limit || PAGINATION_LIMIT,
      skip: params.offset || 0,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  public async getByIdAndSourceAndDestination(params: GetMessagesParams): Promise<[Message[], number]> {
    const { genesis, source, query } = params;
    return this.messageRepo.findAndCount({
      where: getWhere({ genesis, source }, query, ['id', 'source', 'destination']),
      take: params.limit || PAGINATION_LIMIT,
      skip: params.offset || 0,
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
}
