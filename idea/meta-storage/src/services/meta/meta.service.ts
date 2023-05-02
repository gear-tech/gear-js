import { plainToClass } from 'class-transformer';

import { CreateMetaInput } from './input/create-meta.input';
import { Meta } from '../../database/entities';
import { metaRepository } from '../../database/repositories';
import { MetadataNotFound } from '../../common/errors';

export const metaService = {
  async create(createMetaInput: CreateMetaInput): Promise<Meta | null> {
    const metaDB = await metaRepository.get(createMetaInput.hash);

    if (metaDB) return;

    const metaTypeDB = plainToClass(Meta, {
      ...createMetaInput,
      id: createMetaInput.hash,
    });

    return metaRepository.save(metaTypeDB);
  },

  async getByHash(hash: string): Promise<Meta | undefined> {
    const meta = await metaRepository.get(hash);

    if (!meta) {
      throw new MetadataNotFound();
    }

    return meta;
  },
};
