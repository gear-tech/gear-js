import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code, CodeStatus, type PgByteaString } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import type { FindOptionsWhere, Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import { CodeResponseDto } from './dto/code-response.dto.js';
import type { QueryCodesDto } from './dto/query-codes.dto.js';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly codeRepository: Repository<Code>,
  ) {}

  async findAll(query: QueryCodesDto): Promise<PaginatedResponse<CodeResponseDto>> {
    const { limit, offset, status } = query;

    const where: FindOptionsWhere<Code> = {};

    if (status !== undefined) {
      // Convert string status to numeric value for database query
      where.status = CodeStatus[status as keyof typeof CodeStatus];
    }

    const [data, total] = await this.codeRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    const transformedData = plainToInstance(CodeResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: transformedData,
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOne(id: PgByteaString): Promise<CodeResponseDto> {
    const code = await this.codeRepository.findOne({
      where: { id },
    });

    if (!code) {
      throw new NotFoundException(`Code with ID ${id} not found`);
    }

    return plainToInstance(CodeResponseDto, code, {
      excludeExtraneousValues: true,
    });
  }
}
