import { HexString } from '@polkadot/util/types';
import { AddMetaByCodeParams, AddMetaByProgramParams } from '@gear-js/common';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import {
  generateMetahash,
  InvalidMetaHex,
  CodeNotFound,
  ProgramNotFound,
  CodeHasNoMeta,
  ProgramHasNoMeta,
} from '../common';
import { Code, Meta, Program } from '../database/entities';
import { GearHelper } from '../gear';
import { ProgramService } from './program.service';
import { CodeService } from './code.service';
import { getProgramMetadata } from '@gear-js/api';

export class MetaService {
  private repo: Repository<Meta>;

  constructor(
    dataSource: DataSource,
    private programService: ProgramService,
    private codeService: CodeService,
    private gearHelper: GearHelper,
  ) {
    this.repo = dataSource.getRepository(Meta);
  }

  public async getByHashOrCreate(hash: string): Promise<Meta> {
    const meta = await this.getByHash(hash);

    if (meta) return meta;

    return this.save(plainToInstance(Meta, { hash }));
  }

  public async getByHash(hash: string): Promise<Meta> {
    return this.repo.findOneBy({ hash });
  }

  async save(meta: Meta[]): Promise<Meta[]>;
  async save(meta: Meta): Promise<Meta>;
  async save(meta: Meta | Meta[]): Promise<Meta | Meta[]> {
    return this.repo.save(Array.isArray(meta) ? meta : [meta]);
  }

  public async addMetaByCode({ genesis, metaHex, id }: AddMetaByCodeParams): Promise<Meta> {
    let code: Code;

    try {
      code = await this.codeService.get({ id, genesis });
    } catch (error) {
      code = await this.gearHelper.checkCode(id as HexString);
      if (!code) {
        throw new CodeNotFound();
      }
    }

    if (code.meta === null) throw new CodeHasNoMeta();

    const hash = generateMetahash(metaHex as HexString);

    if (code.meta.hash !== hash) throw new InvalidMetaHex();

    const meta = code.meta;
    const metadata = getProgramMetadata(metaHex as HexString);

    meta.hex = metaHex;
    meta.types = metadata.types;

    return this.repo.save(meta);
  }

  public async addMetaByProgram({ id, genesis, metaHex }: AddMetaByProgramParams): Promise<Meta> {
    let program: Program;

    try {
      program = await this.programService.get({ id, genesis });
    } catch (error) {
      program = await this.gearHelper.checkProgram(id as HexString);
      if (!program) {
        throw new ProgramNotFound();
      }
    }

    if (program.meta === null) throw new ProgramHasNoMeta();

    const hash = generateMetahash(metaHex as HexString);

    if (program.meta.hash !== hash) throw new InvalidMetaHex();

    const metadata = getProgramMetadata(metaHex as HexString);

    const meta = program.meta;
    meta.hex = metaHex;
    meta.types = metadata.types;

    return this.repo.save(meta);
  }
}
