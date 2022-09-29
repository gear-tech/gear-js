import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllCodeParams } from '@gear-js/common';

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
      relations: ['programs', 'meta']
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

  public async get(id: string): Promise<Code> {
    return this.codeRepo.findOne({
      where: { id }
    });
  }

  public async save(codes: Code[]): Promise<Code[]> {
    return this.codeRepo.save(codes);
  }

  public async removeByGenesis(genesis: string): Promise<void> {
    await this.codeRepo.delete({ genesis });
  }
}
