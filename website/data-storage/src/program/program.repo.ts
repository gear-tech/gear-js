import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Message, Program } from '../entities';
import { GetAllUserProgramsParams } from '@gear-js/common';
import { sqlWhereWithILike } from '../utils';
import { PAGINATION_LIMIT } from '../config/configuration';

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

  public async remove(programs: Program[]): Promise<Program[]> {
    return this.programRepo.remove(programs);
  }
}
