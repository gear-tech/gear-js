import { generateCodeHash, getProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { Injectable } from '@nestjs/common';
import { AddMetaParams, AddMetaResult, GetStateByCodeParams } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { InvalidProgramMetaHex, MetadataNotFound, ProgramNotFound } from '../common/errors';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { CreateMetaInput } from './types/create-meta.input';

@Injectable()
export class MetaService {
  constructor(
    private programRepository: ProgramRepo,
    private metaRepository: MetaRepo,
  ) {}

  public async getByCodeId(params:  GetStateByCodeParams): Promise<Meta> {
    const { codeId } = params;
    const meta = await this.metaRepository.getByCodeId(codeId);

    if(!meta) throw new MetadataNotFound();

    return meta;
  }

  public async getByHash(hash: string): Promise<Meta> {
    return this.metaRepository.getByHash(hash);
  }

  public async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, metaHex, name } = params;
    const program = await this.programRepository.getByIdAndGenesis(programId, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }

    if(program.meta === null) {
      throw new MetadataNotFound();
    }

    const hash = generateCodeHash(metaHex as HexString);

    this.validateProgramMetaHex(program.meta, hash);
    const metaData = getProgramMetadata(metaHex as HexString);
    const meta = await this.metaRepository.getByHash(hash);

    const updateMeta = plainToClass(Meta, {
      ...meta,
      hex: metaHex,
      types: metaData.types,
      name,
    });

    await this.metaRepository.save(updateMeta);

    return { status: 'Metadata added' };
  }

  public async createMeta(createMetaInput: CreateMetaInput): Promise<Meta> {
    const createMeta = plainToClass(Meta, {
      ...createMetaInput
    });

    return this.metaRepository.save(createMeta);
  }

  private validateProgramMetaHex(programMeta: Meta, hash: string): void {
    if(programMeta.hash !== hash) throw new InvalidProgramMetaHex();
  }
}
