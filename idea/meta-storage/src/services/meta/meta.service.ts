import { plainToClass } from 'class-transformer';
import { HexString } from '@polkadot/util/types';
import { getProgramMetadata } from '@gear-js/api';

import { CreateMetaInput } from './input/create-meta.input';
import { Meta } from '../../database/entities';
import { metaRepository } from '../../database/repositories';
import { MetaAlreadyExists, MetadataNotFound } from '../../common/errors';
import { generateHash } from '../../common/helpers/generate-hash';

export const metaService = {
  async createByIndexer(createMetaInput: CreateMetaInput): Promise<Meta | null> {
    const metaDB = await metaRepository.get(createMetaInput.hash);

    if (metaDB) return;

    const metadata = getProgramMetadata(createMetaInput.hex as HexString);

    const metaTypeDB = plainToClass(Meta, {
      ...createMetaInput,
      id: createMetaInput.hash,
      types: metadata.types,
    });

    return metaRepository.save(metaTypeDB);
  },

  async create(createMetaInput: CreateMetaInput): Promise<Meta> {
    const hash = generateHash(createMetaInput.hex as HexString);

    const meta = await metaRepository.get(hash);

    if (meta) throw new MetaAlreadyExists();

    const metadata = getProgramMetadata(createMetaInput.hex as HexString);

    const metaTypeDB = plainToClass(Meta, {
      ...createMetaInput,
      id: hash,
      types: metadata.types,
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
