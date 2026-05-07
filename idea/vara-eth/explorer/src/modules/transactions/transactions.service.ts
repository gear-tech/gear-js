import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EthereumTx, type PgByteaString } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import { Between, type FindOptionsWhere, type Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import type { QueryTransactionsDto } from './dto/query-transactions.dto.js';
import { TransactionDetailResponseDto } from './dto/transaction-detail-response.dto.js';
import { TransactionListResponseDto } from './dto/transaction-list-response.dto.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(EthereumTx)
    private readonly _transactionRepository: Repository<EthereumTx>,
  ) {}

  async findAll(query: QueryTransactionsDto): Promise<PaginatedResponse<TransactionListResponseDto>> {
    const { limit, offset, selector, sender, fromBlock, toBlock } = query;

    const where: FindOptionsWhere<EthereumTx> = {};

    if (selector) {
      where.selector = selector;
    }

    if (sender) {
      where.sender = sender;
    }

    if (fromBlock !== undefined && toBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(toBlock));
    } else if (fromBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(Number.MAX_SAFE_INTEGER));
    } else if (toBlock !== undefined) {
      where.blockNumber = Between(BigInt(0), BigInt(toBlock));
    }

    const [data, total] = await this._transactionRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    const transformedData = plainToInstance(TransactionListResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: transformedData,
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOne(hash: PgByteaString): Promise<TransactionDetailResponseDto> {
    const transaction = await this._transactionRepository.findOne({
      where: { id: hash },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with hash ${hash} not found`);
    }

    return plainToInstance(TransactionDetailResponseDto, transaction, {
      excludeExtraneousValues: true,
    });
  }
}
