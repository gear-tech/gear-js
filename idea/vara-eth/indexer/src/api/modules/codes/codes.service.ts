import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Code, CodeStatus } from '../../../model/index.js';
import { QueryCodesDto } from './dto/query-codes.dto.js';
import { CodeResponseDto } from './dto/code-response.dto.js';
import { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import { toBytea } from '../../common/utils/hex.util.js';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly codeRepository: Repository<Code>,
  ) {}

  async findAll(query: QueryCodesDto): Promise<PaginatedResponse<CodeResponseDto>> {
    const { limit, offset, sortBy, order, status } = query;

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
        [sortBy!]: order,
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

  async findOne(id: string): Promise<CodeResponseDto> {
    const code = await this.codeRepository.findOne({
      where: { id: toBytea(id)! },
    });

    if (!code) {
      throw new NotFoundException(`Code with ID ${id} not found`);
    }

    return plainToInstance(CodeResponseDto, code, {
      excludeExtraneousValues: true,
    });
  }
}
