import { Repository } from 'typeorm';
import { AddMetaDetailsParams, AddMetahashParams, GetMetaParams } from '@gear-js/common';

import { Code, Meta, AppDataSource } from './database';
import { InvalidParamsError, MetaNotFoundError } from './util/errors';
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
    if (!params.hash && !params.codeHash) {
      throw new InvalidParamsError();
    }

    const meta = await this.get(params);

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

  async get({ hash, codeHash }: GetMetaParams): Promise<Meta> {
    let meta: Meta;

    if (hash) {
      meta = await this.metaRepo.findOne({ where: { hash }, select: { hash: true, hex: true } });
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

    return meta;
  }
}
