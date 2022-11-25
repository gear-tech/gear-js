import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Meta, Program } from '../database/entities';
import { GetAllProgramsParams } from '@gear-js/common';
import { PAGINATION_LIMIT } from '../common/constants';
import { constructQueryBuilder } from '../common/helpers';

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
      select: { meta: { meta: true, program: true } },
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
      select: { meta: { meta: true, program: true } },
    });
  }

  public async list(params: GetAllProgramsParams): Promise<[Program[], number]> {
    const { genesis, query, limit, offset, owner, toDate, fromDate, status } = params;

    const builder = constructQueryBuilder(
      this.programRepo,
      genesis,
      { owner, status },
      { fields: ['id', 'title', 'name', 'code.id'], value: query },
      { fromDate, toDate },
      offset || 0,
      limit || PAGINATION_LIMIT,
      ['code', { table: 'meta', columns: ['id', 'program', 'owner', 'meta'] }],
      { column: 'timestamp', sort: 'DESC' },
    );

    return builder.getManyAndCount();
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
      where: { id, genesis },
    });
  }
}
