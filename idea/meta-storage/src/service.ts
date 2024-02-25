import { Repository } from 'typeorm';
import { AddMetaDetailsParams, AddMetahashParams, GetMetaParams, logger } from '@gear-js/common';

import { Code, Meta, AppDataSource } from './database';
import { InvalidParamsError, MetaNotFoundError } from './util/errors';
import { validateMetaHex } from './util/validate';
import { ProgramMetadata, MetadataVersion, HumanTypesRepr } from '@gear-js/api';

export class MetaService {
  private metaRepo: Repository<Meta>;
  private codeRepo: Repository<Code>;

  constructor() {
    this.metaRepo = AppDataSource.getRepository(Meta);
    this.codeRepo = AppDataSource.getRepository(Code);
  }

  async addMeta({ metahash, codeId }: AddMetahashParams): Promise<string[]> {
    logger.info('Adding meta', { metahash, codeId });
    const meta =
      (await this.metaRepo.findOne({ where: { hash: metahash }, relations: { codes: true } })) ||
      new Meta({ hash: metahash, codes: [] });

    const code = new Code({ id: codeId, meta });
    meta.codes.push(code);

    await this.metaRepo.save(meta);
    await this.codeRepo.save(code);

    return meta.hasState ? [metahash] : [];
  }

  async addMetaDetails(params: AddMetaDetailsParams): Promise<Omit<Meta, 'codes'>> {
    logger.info('Adding meta details', params);
    if (!params.hash && !params.codeHash) {
      throw new InvalidParamsError();
    }

    let meta = await this.get(params, true);

    if (!meta) {
      meta = new Meta({ hash: params.hash });
    }

    if (meta.hex) {
      return { hex: meta.hex, hash: meta.hash, hasState: meta.hasState };
    }

    validateMetaHex(params.hex, meta.hash);

    meta.hex = params.hex;

    let metadata: ProgramMetadata;

    try {
      metadata = ProgramMetadata.from(meta.hex);
    } catch (error) {
      throw new InvalidParamsError('Invalid metadata hex');
    }

    if (metadata.version === MetadataVersion.V1Rust) {
      if (metadata.types.state != null) {
        meta.hasState = true;
      }
    } else {
      if ((metadata.types.state as HumanTypesRepr).output != null) {
        meta.hasState = true;
      }
    }

    await this.metaRepo.save(meta);

    return { hex: meta.hex, hash: meta.hash, hasState: meta.hasState };
  }

  async get({ hash, codeHash }: GetMetaParams, internal = false): Promise<Partial<Meta>> {
    let meta: Meta;

    if (hash) {
      meta = await this.metaRepo.findOne({ where: { hash } });
    } else if (codeHash) {
      const code = await this.codeRepo.findOne({ where: { id: codeHash }, relations: { meta: true } });

      if (!code) {
        throw new MetaNotFoundError();
      }

      meta = code.meta;
    }

    if (!meta) {
      throw new MetaNotFoundError();
    }

    return internal ? meta : { hash: meta.hash, hex: meta.hex };
  }

  async getAllWithState(): Promise<string[]> {
    const meta = await this.metaRepo.find({ where: { hasState: true }, select: { hash: true } });
    return meta.map((m) => m.hash);
  }
}
