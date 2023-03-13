import { HexString } from '@polkadot/util/types';
import { Injectable } from '@nestjs/common';
import { AddMetaByCodeParams, AddMetaParams, AddMetaResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { InvalidMetaHex, CodeHasNoMeta, CodeNotFound, ProgramHasNoMeta, ProgramNotFound } from '../common/errors';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { CreateMetaInput } from '../common/types';
import { CodeRepo } from '../code/code.repo';
import { generateMetaHash, _getProgramMetadata } from '../common/helpers';
import { ProgramService } from '../program/program.service';

@Injectable()
export class MetaService {
  constructor(
    private programRepository: ProgramRepo,
    private programService: ProgramService,
    private metaRepository: MetaRepo,
    private codeRepository: CodeRepo,
  ) {}

  public async getByHashOrCreate(hash: string): Promise<Meta> {
    const meta = await this.getByHash(hash);
    if (meta) return meta;

    return this.createMeta({ hash });
  }

  public async getByHash(hash: string): Promise<Meta> {
    return this.metaRepository.getByHash(hash);
  }

  async createMeta(createMetaInput: CreateMetaInput): Promise<Meta> {
    const createMeta = plainToClass(Meta, {
      ...createMetaInput,
    });

    return this.metaRepository.save(createMeta);
  }

  public async addMetaByCode(params: AddMetaByCodeParams): Promise<AddMetaResult> {
    const { genesis, metaHex, codeId, name } = params;

    const code = await this.codeRepository.get(codeId, genesis);

    if (!code) throw new CodeNotFound();

    if (code.meta === null) throw new CodeHasNoMeta();

    const hash = generateMetaHash(metaHex as HexString);

    if (code.meta.hash !== hash) throw new InvalidMetaHex();

    console.log(code.meta);
    const meta = code.meta;
    const metadata = _getProgramMetadata(metaHex as HexString);

    meta.hex = metaHex;
    meta.types = metadata.types;

    code.name = name;

    await Promise.all([this.metaRepository.save(meta), this.codeRepository.save([code])]);

    return { status: 'Metadata added' };
  }

  public async addMetaByProgram(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, metaHex, name } = params;
    const program = await this.programRepository.getByIdAndGenesis(programId, genesis);

    if (!program) throw new ProgramNotFound();

    if (program.meta === null) throw new ProgramHasNoMeta();

    const hash = generateMetaHash(metaHex as HexString);
    if (program.meta.hash !== hash) throw new InvalidMetaHex();

    const metadata = _getProgramMetadata(metaHex as HexString);
    const meta = program.meta;
    meta.hex = metaHex;
    meta.types = metadata.types;

    program.name = name;

    await Promise.all([this.metaRepository.save(meta), this.programRepository.save([program])]);

    return { status: 'Metadata added' };
  }
}
