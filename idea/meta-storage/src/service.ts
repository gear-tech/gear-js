import { AddMetaDetailsParams, AddMetahashParams, GetMetaParams, logger } from '@gear-js/common';
import { ProgramMetadata, MetadataVersion, HumanTypesRepr } from '@gear-js/api';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { Meta, AppDataSource, SailsIdl } from './database';
import { InvalidParamsError, MetaNotFoundError, SailsIdlNotFoundError } from './util/errors';
import { validateMetaHex } from './util/validate';
import { Code } from './database/entities/code.entity';

const getHash = (data: string) => crypto.createHash('sha256').update(data).digest('hex');

export class MetaService {
  private metaRepo: Repository<Meta>;
  private sailsRepo: Repository<SailsIdl>;
  private codeRepo: Repository<Code>;

  constructor() {
    this.metaRepo = AppDataSource.getRepository(Meta);
    this.sailsRepo = AppDataSource.getRepository(SailsIdl);
    this.codeRepo = AppDataSource.getRepository(Code);
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

  async addIdl({ codeId, data }) {
    if (!codeId || !data) {
      throw new InvalidParamsError();
    }

    const hash = getHash(data);

    logger.info('Adding IDL', { codeId, hash });

    let sails = await this.sailsRepo.findOne({ where: { id: hash } });

    if (!sails) {
      const code = await this.codeRepo.findOne({ where: { id: codeId } });
      if (code) {
        throw new InvalidParamsError('Code already has IDL');
      }
      sails = new SailsIdl({ id: hash, data });
    }

    const code = new Code({ id: codeId, sails });

    await this.sailsRepo.save(sails);
    await this.codeRepo.save(code);

    return { status: 'Sails idl added' };
  }

  async getIdl({ codeId }) {
    const code = await this.codeRepo.findOne({ where: { id: codeId }, relations: { sails: true } });

    if (!code) {
      throw new SailsIdlNotFoundError();
    }

    return code.sails.data;
  }
}
