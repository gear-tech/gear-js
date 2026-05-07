import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateTransition, type PgByteaString } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import type { FindOptionsWhere, Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import type { QueryStateTransitionsDto } from './dto/query-state-transitions.dto.js';
import { StateTransitionResponseDto } from './dto/state-transition-response.dto.js';

@Injectable()
export class StateTransitionsService {
  constructor(
    @InjectRepository(StateTransition)
    private readonly _stateTransitionRepository: Repository<StateTransition>,
  ) {}

  async findAll(query: QueryStateTransitionsDto): Promise<PaginatedResponse<StateTransitionResponseDto>> {
    const { limit, offset, programId, exited } = query;

    const where: FindOptionsWhere<StateTransition> = {};

    if (programId) {
      where.programId = programId;
    }

    if (exited !== undefined) {
      where.exited = exited;
    }

    const [data, total] = await this._stateTransitionRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(StateTransitionResponseDto, data, { excludeExtraneousValues: true }),
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOne(id: PgByteaString): Promise<StateTransitionResponseDto> {
    const stateTransition = await this._stateTransitionRepository.findOne({
      where: { id },
      relations: ['program', 'batch'],
    });

    if (!stateTransition) {
      throw new NotFoundException(`StateTransition with ID ${id} not found`);
    }

    return plainToInstance(StateTransitionResponseDto, stateTransition, { excludeExtraneousValues: true });
  }
}
