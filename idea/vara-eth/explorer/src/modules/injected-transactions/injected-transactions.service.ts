import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectedTransaction, type PgByteaString } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import type { FindOptionsWhere, Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import { InjectedTransactionResponseDto } from './dto/injected-transaction-response.dto.js';
import type { QueryInjectedTransactionsDto } from './dto/query-injected-transactions.dto.js';

@Injectable()
export class InjectedTransactionsService {
  constructor(
    @InjectRepository(InjectedTransaction)
    private readonly _repository: Repository<InjectedTransaction>,
  ) {}

  async findAll(query: QueryInjectedTransactionsDto): Promise<PaginatedResponse<InjectedTransactionResponseDto>> {
    const { limit, offset, destination, senderAddress } = query;

    const where: FindOptionsWhere<InjectedTransaction> = {};

    if (destination) {
      where.destination = destination;
    }

    if (senderAddress) {
      where.senderAddress = senderAddress;
    }

    const [data, total] = await this._repository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return {
      data: plainToInstance(InjectedTransactionResponseDto, data, { excludeExtraneousValues: true }),
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOne(id: PgByteaString): Promise<InjectedTransactionResponseDto> {
    const tx = await this._repository.findOne({ where: { id } });

    if (!tx) {
      throw new NotFoundException(`Injected transaction with ID ${id} not found`);
    }

    return plainToInstance(InjectedTransactionResponseDto, tx, { excludeExtraneousValues: true });
  }
}
