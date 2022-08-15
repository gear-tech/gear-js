import { Meta } from '../../../src/database/entities';
import { METADATA_DB_MOCK } from './metadata-db.mock';

export const mockMetadataRepository = {
  save: jest.fn().mockImplementation((metadata: Meta): Promise<Meta> => {
    return new Promise((resolve) => resolve(metadata));
  }),
  getByProgramId: jest.fn((program: string) => {
    return METADATA_DB_MOCK.find((metadata) => {
      if (metadata.program === program) {
        return metadata;
      }
    });
  }),
};
