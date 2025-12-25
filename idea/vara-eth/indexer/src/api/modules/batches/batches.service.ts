import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Batch } from '../../../model/index.js';
import { QueryBatchesDto } from './dto/query-batches.dto.js';
import { PaginatedResponse } from '../../common/dto/pagination.dto.js';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  async findAll(query: QueryBatchesDto): Promise<PaginatedResponse<Batch>> {
    const { limit, offset, sortBy, order, fromBlock, toBlock } = query;

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
        [sortBy!]: order,
      },
    });

    return {
      data,
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOne(id: string): Promise<Batch> {
    const batch = await this.batchRepository.findOne({
      where: { id: id.toLowerCase() },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }

    return batch;
  }
}
