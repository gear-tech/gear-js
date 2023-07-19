import { Repository } from 'typeorm';
import assert from 'assert';
import { AddMetaDetailsParams, AddMetahashParams, GetMetaByCodeParams, GetMetaParams } from '@gear-js/common';

import { Code, Meta, AppDataSource } from './database';
import { MetaNotFoundError } from './util/errors';
import { validateMetaHex } from './util/validate';

export class MetaService {
  private metaRepo: Repository<Meta>;
  private codeRepo: Repository<Code>;

  constructor() {
    this.metaRepo = AppDataSource.getRepository(Meta);
    this.codeRepo = AppDataSource.getRepository(Code);
  }

  async addMeta(params: AddMetahashParams) {
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
  }

  async addMetaDetails(params: AddMetaDetailsParams): Promise<Omit<Meta, 'codes'>> {
    assert.ok(params.hash || params.codeHash, 'Invalid params');
    const meta = params.hash
      ? await this.getMetaByHash({ hash: params.hash })
      : await this.getMetaByCode({ id: params.codeHash });

    if (!meta) {
      throw new MetaNotFoundError();
    }

    if (meta.hex) {
      return { hex: meta.hex, hash: meta.hash };
    }

    validateMetaHex(params.hex, meta.hash);

    meta.hex = params.hex;

    await this.metaRepo.save(meta);

    return { hex: meta.hex, hash: meta.hash };
  }

  async getMetaByHash({ hash }: GetMetaParams): Promise<Meta> {
    const meta = await this.metaRepo.findOne({ where: { hash }, select: { hash: true, hex: true } });

    if (!meta) {
      throw new MetaNotFoundError();
    }

    return meta;
  }

  async getMetaByCode({ id }: GetMetaByCodeParams): Promise<Omit<Meta, 'codes'>> {
    const code = await this.codeRepo.findOne({ where: { id }, relations: { meta: true } });

    if (!code) {
      throw new MetaNotFoundError();
    }

    return { hex: code.meta.hex, hash: code.meta.hash };
  }
}
