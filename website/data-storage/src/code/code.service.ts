import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetAllCodeParams, GetAllCodeResult, GetCodeParams } from '@gear-js/common';

import { CreateCodeInput } from './types';
import { Code, Program } from '../entities';
import { CodeRepo } from './code.repo';
import { CodeNotFound, MessageNotFound } from '../errors';

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

  public async create(createCodeInput: CreateCodeInput): Promise<Code> {
    const codeTypeDB = plainToClass(Code, {
      ...createCodeInput,
      name: createCodeInput.id,
      timestamp: new Date(createCodeInput.timestamp),
    });

    try {
      return await this.codeRepository.save(codeTypeDB);
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    const listCode = await this.codeRepository.listByGenesis(genesis);
    await this.codeRepository.remove(listCode);
  }
}
