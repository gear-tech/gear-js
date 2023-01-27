import { Meta } from '../../../src/database/entities';

export const mockMetadataRepository = {
  save: jest.fn().mockImplementation((metadata: Meta): Promise<Meta> => {
    return new Promise((resolve) => resolve(metadata));
  }),
};
