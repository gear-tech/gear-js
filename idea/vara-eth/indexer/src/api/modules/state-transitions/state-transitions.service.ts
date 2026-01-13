import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { StateTransition } from '../../../model/index.js';
import { QueryStateTransitionsDto } from './dto/query-state-transitions.dto.js';
import { PaginatedResponse } from '../../common/dto/pagination.dto.js';

@Injectable()
export class StateTransitionsService {
  constructor(
    @InjectRepository(StateTransition)
    private readonly stateTransitionRepository: Repository<StateTransition>,
  ) {}

  async findAll(query: QueryStateTransitionsDto): Promise<PaginatedResponse<StateTransition>> {
    const { limit, offset, sortBy, order, programId, exited } = query;

    const where: FindOptionsWhere<StateTransition> = {};

    if (programId) {
      where.programId = programId.toLowerCase();
    }

    if (exited !== undefined) {
      where.exited = exited;
    }

    const [data, total] = await this.stateTransitionRepository.findAndCount({
      where,
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

  async findOne(id: string): Promise<StateTransition> {
    const stateTransition = await this.stateTransitionRepository.findOne({
      where: { id: id.toLowerCase() },
      relations: ['program', 'batch'],
    });

    if (!stateTransition) {
      throw new NotFoundException(`StateTransition with ID ${id} not found`);
    }

    return stateTransition;
  }
}
