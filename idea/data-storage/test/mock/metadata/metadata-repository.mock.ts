import { Meta } from '../../../src/database/entities';
import { METADATA_DB_MOCK } from './metadata-db.mock';

export const mockMetadataRepository = {
  save: jest.fn().mockImplementation((metadata: Meta): Promise<Meta> => {
    return new Promise((resolve) => resolve(metadata));
  }),
  getByHash: jest.fn().mockImplementation((hash: string): Meta => {
    return METADATA_DB_MOCK.find(meta => {
      if (meta.hash === hash) return meta;
    });
  }),
};
