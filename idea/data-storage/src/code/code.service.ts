import { Injectable, Logger } from '@nestjs/common';
import { GetAllCodeParams, GetAllCodeResult, GetCodeParams, GetMetaByCodeParams } from '@gear-js/common';

import { Code, Meta } from '../database/entities';
import { CodeRepo } from './code.repo';
import { CodeNotFound, MetadataNotFound } from '../common/errors';
import { CodeChangedInput } from '../common/types';

@Injectable()
export class CodeService {
  private logger: Logger = new Logger(CodeService.name);

  constructor(private codeRepository: CodeRepo) {}

  public async getAllCode(params: GetAllCodeParams): Promise<GetAllCodeResult> {
    const [listCode, total] = await this.codeRepository.list(params);
    return {
      listCode,
      count: total,
    };
  }

  public async getByIdAndGenesis(params: GetCodeParams): Promise<Code> {
    const { id, genesis } = params;
    const code = await this.codeRepository.getByIdAndGenesis(id, genesis);
    if (!code) {
      throw new CodeNotFound();
    }
    return code;
  }

  public async getMeta(params: GetMetaByCodeParams): Promise<Meta> {
    const { codeId, genesis } = params;
    const code = await this.codeRepository.getByIdAndGenesis(codeId, genesis);

    if (!code) {
      throw new CodeNotFound();
    }

    if (code.meta === null) throw new MetadataNotFound();

    return code.meta;
  }

  public async createCodes(codes: Code[]) {
    try {
      return this.codeRepository.save(codes);
    } catch (error) {
      this.logger.error('Update codes error');
      console.log(error);
    }
  }

  public async setCodeStatuses(codeStatuses: CodeChangedInput[], genesis: string): Promise<Code[]> {
    const codes = [];

    for (const codeStatus of codeStatuses) {
      const code = await this.codeRepository.getByIdAndGenesis(codeStatus.id, genesis);
      code.expiration = codeStatus.expiration;
      code.status = codeStatus.status;
      codes.push(code);
    }

    try {
      return this.codeRepository.save(codes);
    } catch (error) {
      this.logger.error('Update codes error');
      console.log(error);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    await this.codeRepository.removeByGenesis(genesis);
  }
}
