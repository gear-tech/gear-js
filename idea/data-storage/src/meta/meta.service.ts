import { HexString } from '@polkadot/util/types';
import { Injectable, Logger } from '@nestjs/common';
import { AddMetaByCodeParams, AddMetaParams, AddMetaResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { CodeHasNoMeta, CodeNotFound, ProgramHasNoMeta, ProgramNotFound } from '../common/errors';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { CreateMetaInput } from './types/create-meta.input';
import { CodeRepo } from '../code/code.repo';
import { _generateCodeHash, _getProgramMetadata } from '../common/helpers';
import { ProgramService } from '../program/program.service';
import { AddProgramMetaInput } from '../program/types';
import { InvalidMetaHex } from '../common/errors/base';

@Injectable()
export class MetaService {
  private logger: Logger = new Logger(MetaService.name);
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

    const hash = _generateCodeHash(metaHex as HexString);

    console.log(params);
    console.log(hash);
    console.log(code.meta);

    if (code.meta.hash !== hash) throw new InvalidMetaHex();

    const meta = await this.metaRepository.getByHash(hash);
    const metaData = _getProgramMetadata(metaHex as HexString);

    if (meta) {
      const updateMeta = plainToClass(Meta, { ...meta, hex: metaHex, types: metaData.types });

      code.meta = await this.metaRepository.save(updateMeta);
      code.name = name;

      const addProgramsMeta: AddProgramMetaInput = { name, meta };

      await Promise.all([
        this.codeRepository.save([code]),
        this.programService.addProgramsMetaByCode(codeId, genesis, addProgramsMeta),
      ]);
    } else {
      const createMetaInput: CreateMetaInput = { hex: metaHex, hash, types: metaData.types };
      const createMeta = await this.createMeta(createMetaInput);
      code.meta = createMeta;
      code.name = name;

      const addProgramsMeta: AddProgramMetaInput = { name, meta: createMeta };

      await Promise.all([
        this.codeRepository.save([code]),
        this.programService.addProgramsMetaByCode(codeId, genesis, addProgramsMeta),
      ]);
    }

    return { status: 'Metadata added' };
  }

  public async addMetaByProgram(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, metaHex, name } = params;
    const program = await this.programRepository.getByIdAndGenesis(programId, genesis);

    if (!program) throw new ProgramNotFound();

    if (program.meta === null) throw new ProgramHasNoMeta();

    const hash = _generateCodeHash(metaHex as HexString);
    console.log(program.meta);
    console.log(hash);
    if (program.meta.hash !== hash) throw new InvalidMetaHex();

    const metaData = _getProgramMetadata(metaHex as HexString);
    const meta = program.meta;

    const updateMeta = plainToClass(Meta, {
      ...meta,
      hex: metaHex,
      types: metaData.types,
    });

    program.name = name;

    await Promise.all([this.metaRepository.save(updateMeta), this.programRepository.save([program])]);

    return { status: 'Metadata added' };
  }
}
