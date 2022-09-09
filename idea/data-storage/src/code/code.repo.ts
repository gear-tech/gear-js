import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { GetAllCodeParams } from '@gear-js/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Code } from '../database/entities';
import { sqlWhereWithILike } from '../utils/sql-where-with-ilike';
import { PAGINATION_LIMIT } from '../common/constants';
import { CodeStatus } from '../common/enums';

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
        status: CodeStatus.ACTIVE,
      },
    });
  }

  public async listPaginationByGenesis(params: GetAllCodeParams): Promise<[Code[], number]> {
    const { genesis, query, limit, offset } = params;
    return this.codeRepo.findAndCount({
      where: sqlWhereWithILike({ genesis, status: CodeStatus.ACTIVE }, query, ['id', 'name']),
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

  public async update(
    where: FindOptionsWhere<Code>,
    partialEntity: QueryDeepPartialEntity<Code>,
  ): Promise<UpdateResult> {
    return this.codeRepo.update(where, partialEntity);
  }

  public async removeByGenesis(genesis: string): Promise<void> {
    await this.codeRepo.delete({ genesis });
  }
}
