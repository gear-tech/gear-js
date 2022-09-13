import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetAllCodeParams, GetAllCodeResult, GetCodeParams } from '@gear-js/common';

import { Code } from '../database/entities';
import { CodeRepo } from './code.repo';
import { CodeNotFound } from '../common/errors';
import { UpdateResult } from 'typeorm';
import { UpdateCodeInput } from './types';

@Injectable()
export class CodeService {
  private logger: Logger = new Logger('CodeService');
  constructor(private codeRepository: CodeRepo) {}

  public async getAllCode(params: GetAllCodeParams): Promise<GetAllCodeResult> {
    const [listCode, total] = await this.codeRepository.listPaginationByGenesis(params);
    return {
      listCode,
      count: total,
    };
  }

  public async getByIdAndGenesis(params: GetCodeParams): Promise<Code> {
    const { codeId, genesis } = params;
    const code = await this.codeRepository.getByIdAndGenesis(codeId, genesis);
    if (!code) {
      throw new CodeNotFound();
    }
    return code;
  }

  public async updateCode(updateCodeInput: UpdateCodeInput): Promise<Code | UpdateResult> {
    const { id, genesis } = updateCodeInput;
    const code = await this.codeRepository.getByIdAndGenesis(id, genesis);

    if (code) {
      return this.updateCodeData(code, updateCodeInput);
    } else {
      return this.create(updateCodeInput);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    await this.codeRepository.removeByGenesis(genesis);
  }

  private async create(updateCodeInput: UpdateCodeInput): Promise<Code> {
    const codeTypeDB = plainToClass(Code, {
      ...updateCodeInput,
      name: updateCodeInput.id,
      timestamp: new Date(updateCodeInput.timestamp),
    });

    try {
      return await this.codeRepository.save(codeTypeDB);
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  private async updateCodeData(codeEntityDB: Code, updateCodeInput: UpdateCodeInput): Promise<UpdateResult> {
    const { id, genesis } = updateCodeInput;

    return this.codeRepository.update(
      { id, genesis },
      {
        status: updateCodeInput.status,
        expiration: updateCodeInput.expiration,
      },
    );
  }
}
