import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllCodeParams } from '@gear-js/common';

import { Code } from '../database/entities';
import { PAGINATION_LIMIT } from '../common/constants';
import { CodeStatus } from '../common/enums';
import { constructQueryBuilder } from '../common/helpers';

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

  public async list(params: GetAllCodeParams): Promise<[Code[], number]> {
    const { genesis, query, limit, offset, name, toDate, fromDate, uploadedBy } = params;

    const builder = constructQueryBuilder(
      this.codeRepo,
      genesis,
      { uploadedBy, name },
      { fields: ['id', 'name'], value: query },
      { fromDate, toDate },
      offset || 0,
      limit || PAGINATION_LIMIT,
      undefined,
      { column: 'timestamp', sort: 'DESC' },
    );

    return builder.getManyAndCount();
  }

  public async get(id: string, genesis: string): Promise<Code> {
    return this.codeRepo.findOne({
      where: { id, genesis },
    });
  }

  public async save(codes: Code[]): Promise<Code[]> {
    return this.codeRepo.save(codes);
  }

  public async removeByGenesis(genesis: string): Promise<void> {
    await this.codeRepo.delete({ genesis });
  }
}
