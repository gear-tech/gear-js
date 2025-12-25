import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Program } from '../../../model/index.js';
import { QueryProgramsWithBlockRangeDto } from './dto/query-programs.dto.js';
import { ProgramResponseDto } from './dto/program-response.dto.js';
import { PaginatedResponse } from '../../common/dto/pagination.dto.js';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async findAll(query: QueryProgramsWithBlockRangeDto): Promise<PaginatedResponse<ProgramResponseDto>> {
    const { limit, offset, sortBy, order, codeId, fromBlock, toBlock } = query;

    const where: FindOptionsWhere<Program> = {};

    if (codeId) {
      where.codeId = codeId.toLowerCase();
    }

    if (fromBlock !== undefined && toBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(toBlock));
    } else if (fromBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(Number.MAX_SAFE_INTEGER));
    } else if (toBlock !== undefined) {
      where.blockNumber = Between(BigInt(0), BigInt(toBlock));
    }

    const [data, total] = await this.programRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        [sortBy!]: order,
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

  async findOne(id: string): Promise<ProgramResponseDto> {
    const program = await this.programRepository.findOne({
      where: { id: id.toLowerCase() },
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
