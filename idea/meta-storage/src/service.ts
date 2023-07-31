import { Repository } from 'typeorm';
import { AddMetaDetailsParams, AddMetahashParams, GetMetaParams } from '@gear-js/common';

import { Code, Meta, AppDataSource } from './database';
import { InvalidParamsError, MetaNotFoundError } from './util/errors';
import { validateMetaHex } from './util/validate';
import { getProgramMetadata } from '@gear-js/api';

export class MetaService {
  private metaRepo: Repository<Meta>;
  private codeRepo: Repository<Code>;

  constructor() {
    this.metaRepo = AppDataSource.getRepository(Meta);
    this.codeRepo = AppDataSource.getRepository(Code);
  }

  async addMeta(params: AddMetahashParams): Promise<string[]> {
    const metaArray: Meta[] = [];
    const codeArray: Code[] = [];

    for (const [hash, codeIds] of params) {
      const meta =
        (await this.metaRepo.findOne({ where: { hash }, relations: { codes: true } })) || new Meta({ hash, codes: [] });

      const codes = codeIds.map((id) => new Code({ id, meta }));

      meta.codes.push(...codes);
      codeArray.push(...codes);
      metaArray.push(meta);
    }

    await this.metaRepo.save(metaArray);
    await this.codeRepo.save(codeArray);

    return metaArray.filter(({ hasState }) => hasState === true).map(({ hash }) => hash);
  }

  async addMetaDetails(params: AddMetaDetailsParams): Promise<Omit<Meta, 'codes'>> {
    if (!params.hash && !params.codeHash) {
      throw new InvalidParamsError();
    }

    const meta = await this.get(params, true);

    if (!meta) {
      throw new MetaNotFoundError();
    }

    if (meta.hex) {
      return { hex: meta.hex, hash: meta.hash, hasState: meta.hasState };
    }

    validateMetaHex(params.hex, meta.hash);

    meta.hex = params.hex;

    const metadata = getProgramMetadata(meta.hex);
    if (metadata.types.state) {
      meta.hasState = true;
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
