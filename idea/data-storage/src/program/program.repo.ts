import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Program } from '../database/entities';
import { GetAllProgramsParams, GetAllUserProgramsParams } from '@gear-js/common';
import { sqlWhereWithILike } from '../utils/sql-where-with-ilike';
import { PAGINATION_LIMIT } from '../common/constants';

@Injectable()
export class ProgramRepo {
  constructor(
    @InjectRepository(Program)
    private programRepo: Repository<Program>,
  ) {}

  public async save(program: Program): Promise<Program> {
    return this.programRepo.save(program);
  }

  public async getByIdAndGenesis(id: string, genesis: string): Promise<Program> {
    return this.programRepo.findOne({
      where: { id, genesis },
      select: {
        id: true,
        genesis: true,
        blockHash: true,
        timestamp: true,
        owner: true,
        name: true,
        initStatus: true,
        title: true,
        meta: { meta: true },
      },
      relations: ['meta'],
    });
  }

  public async getByIdAndGenesisAndOwner(id: string, genesis: string, owner: string): Promise<Program> {
    return this.programRepo.findOne({
      where: {
        id,
        genesis,
        owner,
      },
      select: {
        id: true,
        genesis: true,
        blockHash: true,
        timestamp: true,
        owner: true,
        name: true,
        initStatus: true,
        title: true,
        meta: { meta: true },
      },
      relations: ['meta'],
    });
  }

  public async listByOwnerAndGenesis(params: GetAllUserProgramsParams): Promise<[Program[], number]> {
    const { genesis, owner, query, limit, offset } = params;
    return this.programRepo.findAndCount({
      where: sqlWhereWithILike({ genesis, owner }, query, ['id', 'title', 'name']),
      take: limit || PAGINATION_LIMIT,
      skip: offset || 0,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  public async listPaginationByGenesis(params: GetAllProgramsParams): Promise<[Program[], number]> {
    const { genesis, query, limit, offset } = params;
    return this.programRepo.findAndCount({
      where: sqlWhereWithILike({ genesis }, query, ['id', 'title', 'name']),
      take: limit || PAGINATION_LIMIT,
      skip: offset || 0,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  public async listByGenesis(genesis: string): Promise<Program[]> {
    return this.programRepo.find({
      where: {
        genesis,
      },
    });
  }

  public async remove(programs: Program[]): Promise<Program[]> {
    return this.programRepo.remove(programs);
  }
}
