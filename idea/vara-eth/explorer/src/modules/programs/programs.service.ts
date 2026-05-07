import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program, type PgByteaString } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import { Between, type FindOptionsWhere, type Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import { ProgramResponseDto } from './dto/program-response.dto.js';
import type { QueryProgramsDto } from './dto/query-programs.dto.js';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly _programRepository: Repository<Program>,
  ) {}

  async findAll(query: QueryProgramsDto): Promise<PaginatedResponse<ProgramResponseDto>> {
    const { limit, offset, codeId, fromBlock, toBlock } = query;

    const where: FindOptionsWhere<Program> = {};

    if (codeId) {
      where.codeId = codeId;
    }

    if (fromBlock !== undefined && toBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(toBlock));
    } else if (fromBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(Number.MAX_SAFE_INTEGER));
    } else if (toBlock !== undefined) {
      where.blockNumber = Between(BigInt(0), BigInt(toBlock));
    }

    const [data, total] = await this._programRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    const transformedData = plainToInstance(ProgramResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: transformedData,
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOne(id: PgByteaString): Promise<ProgramResponseDto> {
    const program = await this._programRepository.findOne({
      where: { id },
      relations: ['code'],
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }

    return plainToInstance(ProgramResponseDto, program, {
      excludeExtraneousValues: true,
    });
  }
}
