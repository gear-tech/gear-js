import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Program } from '../database/entities';
import { GetAllProgramsParams } from '@gear-js/common';
import { PAGINATION_LIMIT } from '../common/constants';
import { queryFilter } from '../common/helpers';

@Injectable()
export class ProgramRepo {
  constructor(
    @InjectRepository(Program)
    private programRepo: Repository<Program>,
  ) {}

  public async save(programs: Program[]): Promise<Program[]> {
    return this.programRepo.save(programs);
  }

  public async getByIdAndGenesis(id: string, genesis: string): Promise<Program> {
    return this.programRepo.findOne({
      where: { id, genesis },
      relations: ['meta', 'messages', 'code'],
      select: { meta: { meta: true, program: true, id: true } },
    });
  }

  public async getByOwnerAndGenesis(owner: string, genesis: string): Promise<Program> {
    return this.programRepo.findOne({
      where: {
        owner,
        genesis
      }
    });
  }

  public async getByIdAndGenesisAndOwner(id: string, genesis: string, owner: string): Promise<Program> {
    return this.programRepo.findOne({
      where: {
        id,
        genesis,
        owner,
      },
      relations: ['meta', 'messages', 'code'],
      select: { meta: { meta: true, program: true, id: true } },
    });
  }

  public async listPaginationByGenesis(params: GetAllProgramsParams): Promise<[Program[], number]> {
    const { genesis, query, limit, offset, owner, toDate, fromDate, status } = params;
    return this.programRepo.findAndCount({
      where: queryFilter(
        { genesis },
        { query, owner, fromDate, toDate, status },
        ['id', 'title', 'name']),
      take: limit || PAGINATION_LIMIT,
      skip: offset || 0,
      relations: ['meta', 'code'],
      select: { meta: { meta: true, program: true, id: true } },
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

  public async get(id: string, genesis: string): Promise<Program> {
    return this.programRepo.findOne({
      where: { id, genesis }
    });
  }
}
