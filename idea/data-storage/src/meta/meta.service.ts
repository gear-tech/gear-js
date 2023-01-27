import { generateCodeHash, getProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { Injectable } from '@nestjs/common';
import {
  AddMetaByCodeParams,
  AddMetaParams,
  AddMetaResult,
  GetMetaByCodeParams,
} from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { CodeNotFound, InvalidProgramMetaHex, MetadataNotFound, ProgramNotFound } from '../common/errors';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { CreateMetaInput } from './types/create-meta.input';
import { CodeRepo } from '../code/code.repo';

@Injectable()
export class MetaService {
  constructor(
    private programRepository: ProgramRepo,
    private metaRepository: MetaRepo,
    private codeRepository: CodeRepo,
  ) {}

  public async getByCodeId(params: GetMetaByCodeParams): Promise<Meta> {
    const { codeId } = params;
    const meta = await this.metaRepository.getByCodeId(codeId);

    if(!meta) throw new MetadataNotFound();

    return meta;
  }

  public async getByHash(hash: string): Promise<Meta> {
    return this.metaRepository.getByHash(hash);
  }

  public async addMetaByCode(params: AddMetaByCodeParams): Promise<AddMetaResult> {
    const { genesis, metaHex, codeId } = params;

    const code = await this.codeRepository.get(codeId, genesis);

    if(!code) throw new CodeNotFound();

    const hash = generateCodeHash(metaHex as HexString);
    const meta = await this.metaRepository.getByHash(hash);
    const metaData = getProgramMetadata(metaHex as HexString);

    if(meta) {
      this.validateMetaHex(meta, hash);

      const updateMeta = plainToClass(Meta, { ...meta, hex: metaHex, types: metaData.types });

      code.meta = await this.metaRepository.save(updateMeta);
      await this.codeRepository.save([code]);
    } else {
      const createMetaInput: CreateMetaInput = { hex: metaHex, hash, types: metaData.types };
      code.meta = await this.createMeta(createMetaInput);
      await this.codeRepository.save([code]);
    }

    return { status: 'Metadata added' };
  }

  public async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, metaHex, name } = params;
    const program = await this.programRepository.getByIdAndGenesis(programId, genesis);

    if (!program) throw new ProgramNotFound();

    if(program.meta === null) throw new MetadataNotFound();

    const hash = generateCodeHash(metaHex as HexString);

    this.validateMetaHex(program.meta, hash);
    const metaData = getProgramMetadata(metaHex as HexString);
    const meta = await this.metaRepository.getByHash(hash);

    const updateMeta = plainToClass(Meta, {
      ...meta,
      hex: metaHex,
      types: metaData.types,
    });

    program.name = name;

    await Promise.all([
      this.metaRepository.save(updateMeta),
      this.programRepository.save([program])
    ]);

    return { status: 'Metadata added' };
  }

  public async createMeta(createMetaInput: CreateMetaInput): Promise<Meta> {
    const createMeta = plainToClass(Meta, {
      ...createMetaInput
    });

    return this.metaRepository.save(createMeta);
  }

  private validateMetaHex(programMeta: Meta, hash: string): void {
    if(programMeta.hash !== hash) throw new InvalidProgramMetaHex();
  }
}
