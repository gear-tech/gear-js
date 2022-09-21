import { signatureIsValid } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from '@gear-js/common';

import { SignatureNotVerified, MetadataNotFound } from '../common/errors';
import { ProgramService } from '../program/program.service';
import { Meta } from '../database/entities';
import { sleep } from '../utils/sleep';
import { MetadataRepo } from './metadata.repo';
import { ProgramRepo } from '../program/program.repo';
import { plainToClass } from 'class-transformer';
import { UpdateProgramDataInput } from '../program/types';

@Injectable()
export class MetadataService {
  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private metadataRepository: MetadataRepo,
  ) {}

  async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, signature, meta, title, name } = params;
    const [_, program] = await Promise.all([sleep(1000), this.programRepository.getByIdAndGenesis(programId, genesis)]);

    try {
      if (!signatureIsValid(program.owner, signature, meta)) {
        throw new SignatureNotVerified();
      }
    } catch (err) {
      throw new SignatureNotVerified(err.message);
    }
    const metadataTypeDB = plainToClass(Meta, {
      ...params,
      meta: this.isStringMetaParam(params.meta) ? params.meta : JSON.stringify(params.meta),
      program: program.id,
      owner: program.owner,
    });

    const metadata = await this.metadataRepository.save(metadataTypeDB);

    const updateProgramDataInput: UpdateProgramDataInput = {
      id: params.programId,
      genesis,
      name,
      title,
      meta: metadata,
    };
    await this.programService.updateProgramData(updateProgramDataInput);

    return { status: 'Metadata added' };
  }

  async getMeta(params: GetMetaParams): Promise<GetMetaResult> {
    const meta = await this.metadataRepository.getByProgramId(params.programId);
    if (!meta) {
      throw new MetadataNotFound();
    }
    return meta;
  }

  private isStringMetaParam(meta: string): boolean {
    return typeof meta === 'string';
  }
}
