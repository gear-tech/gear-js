import { Repository } from 'typeorm';
import { GearKeyring, Metadata } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from '@gear-js/common';

import { SignatureNotVerified, MetadataNotFound } from '../errors';
import { ProgramService } from '../program/program.service';
import { Meta } from '../entities/meta.entity';
import { sleep } from '../utils';
import { MetadataRepo } from './metadata.repo';
import { ProgramRepo } from '../program/program.repo';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MetadataService {
  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private metadataRepository: MetadataRepo,
  ) {}

  async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, signature, meta } = params;
    const [_, program] = await Promise.all([sleep(1000), this.programRepository.getByIdAndGenesis(programId, genesis)]);

    try {
      if (!GearKeyring.checkSign(program.owner, signature, meta)) {
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
    await this.programService.addProgramInfo(params.programId, params.genesis, params.name, params.title, metadata);

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
