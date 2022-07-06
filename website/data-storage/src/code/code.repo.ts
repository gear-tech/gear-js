import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CODE_STATUS, GetAllCodeParams } from '@gear-js/common';

import { Code } from '../entities';
import { sqlWhereWithILike } from '../utils/sql-where-with-ilike';
import { PAGINATION_LIMIT } from '../config/configuration';

@Injectable()
export class CodeRepo {
  constructor(
    @InjectRepository(Code)
    private codeRepo: Repository<Code>,
  ) {}

  public async getByIdAndGenesis(id: string, genesis: string): Promise<Code> {
    return this.codeRepo.findOne({
      where: {
        id,
        genesis,
        status: CODE_STATUS.ACTIVE,
      },
    });
  }

  public async listPaginationByGenesis(params: GetAllCodeParams): Promise<[Code[], number]> {
    const { genesis, query, limit, offset } = params;
    return this.codeRepo.findAndCount({
      where: {
        ...sqlWhereWithILike({ genesis }, query, ['id', 'name']),
        status: CODE_STATUS.ACTIVE,
      },
      take: limit || PAGINATION_LIMIT,
      skip: offset || 0,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  public async save(code: Code): Promise<Code> {
    return this.codeRepo.save(code);
  }

  public async removeByGenesis(genesis: string): Promise<void> {
    await this.codeRepo.delete({ genesis });
  }
}
