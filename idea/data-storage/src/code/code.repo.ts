import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllCodeParams } from '@gear-js/common';

import { Code } from '../database/entities';
import { PAGINATION_LIMIT } from '../common/constants';
import { CodeStatus } from '../common/enums';
import { queryFilter } from '../common/helpers';

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
      relations: ['programs', 'meta'],
      select: { meta: { meta: true, program: true } },
    });
  }

  public async listPaginationByGenesis(params: GetAllCodeParams): Promise<[Code[], number]> {
    const { genesis, query, limit, offset, name, toDate, fromDate, uploadedBy } = params;
    return this.codeRepo.findAndCount({
      where: queryFilter(
        { genesis, status: CodeStatus.ACTIVE },
        { query, name, toDate, fromDate, uploadedBy },
        ['id', 'name']),
      take: limit || PAGINATION_LIMIT,
      skip: offset || 0,
      order: { timestamp: 'DESC' },
    });
  }

  public async get(id: string, genesis: string): Promise<Code> {
    return this.codeRepo.findOne({
      where: { id, genesis }
    });
  }

  public async save(codes: Code[]): Promise<Code[]> {
    return this.codeRepo.save(codes);
  }

  public async removeByGenesis(genesis: string): Promise<void> {
    await this.codeRepo.delete({ genesis });
  }
}
