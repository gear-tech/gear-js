import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetAllCodeParams, GetAllCodeResult, GetCodeParams } from '@gear-js/common';

import { Code } from '../database/entities';
import { CodeRepo } from './code.repo';
import { CodeNotFound } from '../common/errors';
import { CodeChangedInput, UpdateCodeInput } from './types';

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

  public async updateCodes(updateCodesInput: UpdateCodeInput[] | CodeChangedInput[]): Promise<Code[]> {
    let updateCodes = [];

    for(const updateCodeInput of updateCodesInput){
      const { id, genesis } = updateCodeInput;
      const code = await this.codeRepository.getByIdAndGenesis(id, genesis);

      if(code) {
        const updateCode = plainToClass(Code, {
          ...code,
          status: updateCodeInput.status,
          expiration: updateCodeInput.expiration,
        });
        updateCodes = [...updateCodes, updateCode];
      } else {
        const createCode =  plainToClass(Code, {
          ...updateCodeInput,
          name: updateCodeInput.id,
          timestamp: new Date(updateCodeInput.timestamp),
        });
        updateCodes = [...updateCodes, createCode];
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
