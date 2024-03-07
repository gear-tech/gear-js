import { Repository } from 'typeorm';
import { AddMetaDetailsParams, AddMetahashParams, GetMetaParams, logger } from '@gear-js/common';

import { Meta, AppDataSource } from './database';
import { InvalidParamsError, MetaNotFoundError } from './util/errors';
import { validateMetaHex } from './util/validate';
import { ProgramMetadata, MetadataVersion, HumanTypesRepr } from '@gear-js/api';

export class MetaService {
  private metaRepo: Repository<Meta>;

  constructor() {
    this.metaRepo = AppDataSource.getRepository(Meta);
  }

  async addMeta({ metahash }: AddMetahashParams): Promise<string[]> {
    logger.info('Adding meta', { metahash });
    const meta = (await this.metaRepo.findOne({ where: { hash: metahash } })) || new Meta({ hash: metahash });

    await this.metaRepo.save(meta);

    return meta.hasState ? [metahash] : [];
  }

  async addMetaDetails(params: AddMetaDetailsParams): Promise<Omit<Meta, 'codes'>> {
    logger.info('Adding meta details', params);
    if (!params.hash) {
      throw new InvalidParamsError();
    }

    let meta = await this.metaRepo.findOneBy({ hash: params.hash });

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

  async get({ hash }: GetMetaParams): Promise<Partial<Meta>> {
    if (!hash) {
      throw new InvalidParamsError();
    }
    const meta = await this.metaRepo.findOne({ where: { hash } });

    if (!meta) {
      throw new MetaNotFoundError();
    }

    return meta;
  }

  async getAllWithState(): Promise<string[]> {
    const meta = await this.metaRepo.find({ where: { hasState: true }, select: { hash: true } });
    return meta.map((m) => m.hash);
  }
}
