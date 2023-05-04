import { plainToInstance } from 'class-transformer';
import { HexString } from '@polkadot/util/types';
import { generateCodeHash, getProgramMetadata, ProgramMetadata } from '@gear-js/api';

import { CreateMetaInput } from './input/create-meta.input';
import { metaRepository } from '../../database/repositories';
import { MetadataNotFound } from '../../common/errors';
import { Meta } from '../../database/entities/meta.entity';

export const metaService = {
  async create(createMetaInput: CreateMetaInput): Promise<Meta | null> {
    const { hex, hash } = createMetaInput;
    const hashStr = hex ? generateCodeHash(hex as HexString) : hash;
    const metaDB = await metaRepository.get(hashStr);
    let metadata: ProgramMetadata;

    if (metaDB && metaDB.hex !== null) return;

    const metaTypeDB = plainToInstance(Meta, {
      hash,
      hex,
    });

    if (hex) {
      metadata = getProgramMetadata(hex as HexString);
      metaTypeDB.types = metadata.types;
    }

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
