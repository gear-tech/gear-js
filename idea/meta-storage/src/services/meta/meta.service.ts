import { plainToInstance } from 'class-transformer';
import { HexString } from '@polkadot/util/types';
import { generateCodeHash, getProgramMetadata } from '@gear-js/api';

import { CreateMetaInput } from './input/create-meta.input';
import { metaRepository } from '../../database/repositories';
import { MetadataNotFound } from '../../common/errors';
import { Meta } from '../../database/entities/meta.entity';

export const metaService = {
  async createByIndexer(createMetaInput: CreateMetaInput): Promise<Meta | null> {
    const metaDB = await metaRepository.get(createMetaInput.hash);

    if (metaDB) return;

    const metaTypeDB = plainToInstance(Meta, {
      id: createMetaInput.hash,
    });

    return metaRepository.save(metaTypeDB);
  },

  async create(createMetaInput: CreateMetaInput): Promise<string> {
    const hash = generateCodeHash(createMetaInput.hex as HexString);
    const responseMessage = 'Request succeeded';

    const meta = await metaRepository.get(hash);

    if (meta && meta.hex !== null) return responseMessage;

    const metadata = getProgramMetadata(createMetaInput.hex as HexString);

    const metaTypeDB = plainToInstance(Meta, {
      ...createMetaInput,
      ...metadata,
      types: metadata.types,
    });

    await metaRepository.save(metaTypeDB);

    return responseMessage;
  },

  async getByHash(hash: string): Promise<Meta | undefined> {
    const meta = await metaRepository.get(hash);

    if (!meta) {
      throw new MetadataNotFound();
    }

    return meta;
  },
};
