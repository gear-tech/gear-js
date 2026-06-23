import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch, type PgByteaString } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import { Between, type FindOptionsWhere, type Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import type { PaginatedBlockRangeDTO } from '../../common/dto/range.dto.js';
import { BatchResponseDto } from './dto/batch-response.dto.js';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  async findAll(query: PaginatedBlockRangeDTO): Promise<PaginatedResponse<BatchResponseDto>> {
    const { limit, offset, fromBlock, toBlock } = query;

    const where: FindOptionsWhere<Batch> = {};

    if (fromBlock !== undefined && toBlock !== undefined) {
      where.committedAtBlock = Between(BigInt(fromBlock), BigInt(toBlock));
    } else if (fromBlock !== undefined) {
      where.committedAtBlock = Between(BigInt(fromBlock), BigInt(Number.MAX_SAFE_INTEGER));
    } else if (toBlock !== undefined) {
      where.committedAtBlock = Between(BigInt(0), BigInt(toBlock));
    }

    const [data, total] = await this.batchRepository.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      take: limit,
      skip: offset,
      order: {
        committedAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(BatchResponseDto, data, { excludeExtraneousValues: true }),
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOne(id: PgByteaString): Promise<BatchResponseDto> {
    const batch = await this.batchRepository.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }

    return plainToInstance(BatchResponseDto, batch, { excludeExtraneousValues: true });
  }
}
