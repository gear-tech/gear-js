import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetAllCodeParams, GetAllCodeResult, GetCodeParams, GetMetaByCodeParams } from '@gear-js/common';

import { Code, Meta } from '../database/entities';
import { CodeRepo } from './code.repo';
import { CodeNotFound, MetadataNotFound } from '../common/errors';
import { CodeChangedInput, UpdateCodeInput } from './types';

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

    if(code.meta === null) throw new MetadataNotFound();

    return code.meta;
  }

  public async addMeta(codeId: string, genesis: string, meta: Meta): Promise<void> {
    const code = await this.codeRepository.get(codeId, genesis);

    if(code && code.meta !== null) {
      code.meta = meta;
      await this.codeRepository.save([code]);
    }
  }

  public async updateCodes(updateCodesInput: UpdateCodeInput[] | CodeChangedInput[]): Promise<Code[]> {
    const updateCodes = [];

    for (const updateCodeInput of updateCodesInput) {
      const { id, genesis } = updateCodeInput;
      const code = await this.codeRepository.getByIdAndGenesis(id, genesis);

      if (code) {
        const updateCode = plainToClass(Code, {
          ...code,
          status: updateCodeInput.status,
          expiration: updateCodeInput.expiration,
        });

        updateCodes.push(updateCode);
      } else {
        const createCode = plainToClass(Code, {
          ...updateCodeInput,
          name: updateCodeInput.id,
          timestamp: new Date(updateCodeInput.timestamp),
        });

        updateCodes.push(createCode);
      }
    }

    try {
      return this.codeRepository.save(updateCodes);
    } catch (error) {
      this.logger.error('Update codes error');
      console.log(error);
    }
  }

  public async deleteRecords(genesis: string): Promise<void> {
    await this.codeRepository.removeByGenesis(genesis);
  }
}
