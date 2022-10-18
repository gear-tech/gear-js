import { Block } from '../../../src/database/entities';
import { BLOCK_DB_MOCK } from './block-db.mock';

export const mockBlockRepository = {
  getLastBlock: jest.fn(() => {
    const dates = BLOCK_DB_MOCK.map(block => block.timestamp);
    const max = new Date(Math.max(...dates as any));

    return [BLOCK_DB_MOCK.find(block => {
      return block.timestamp.toString() === max.toString();
    })];
  }),
  save: jest.fn().mockImplementation((blocks: Block[]): Promise<Block[]> => {
    return new Promise((resolve) => resolve(blocks));
  }),
};
