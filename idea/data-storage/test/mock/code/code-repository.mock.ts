import { GetAllCodeParams } from '@gear-js/common';

import { Code } from '../../../src/database/entities';
import { CODE_DB_MOCK } from './code-db.mock';

export const mockCodeRepository = {
  listByGenesis: jest.fn((genesis: string) => {
    return CODE_DB_MOCK.filter((code) => {
      if (code.genesis === genesis) {
        return code;
      }
    });
  }),
  getByIdAndGenesis: jest.fn((id: string, genesis: string) => {
    return CODE_DB_MOCK.find((code) => {
      if (code.id === id && code.genesis === genesis) {
        return code;
      }
    });
  }),
  list: jest.fn((params: GetAllCodeParams) => {
    const { genesis, limit } = params;
    const listCode = CODE_DB_MOCK.filter((code) => {
      if (code.genesis === genesis) {
        return code;
      }
    });
    return [listCode, limit];
  }),
  get: jest.fn((codeId: string, genesis: string): Code => {
    return CODE_DB_MOCK.find((code) => {
      if (code.genesis === genesis && code.id === codeId) {
        return code;
      }
    });
  }),
  save: jest.fn().mockImplementation((codes: Code[]): Promise<Code[]> => {
    return new Promise((resolve) => resolve(codes));
  }),

  update: jest.fn().mockImplementation((messageEntityDB: Code, updateCodeInput: Code): Promise<Code> => {
    const { id, genesis } = messageEntityDB;
    const updateCodeIndex = CODE_DB_MOCK.findIndex((code) => code.id === id || code.genesis === genesis);
    CODE_DB_MOCK[updateCodeIndex] = { ...CODE_DB_MOCK[updateCodeIndex], ...updateCodeInput };

    return new Promise((resolve) => resolve(CODE_DB_MOCK[updateCodeIndex]));
  }),
  removeByGenesis: jest.fn().mockImplementation((genesis: string): Code[] => {
    return CODE_DB_MOCK.filter((code) => {
      if (code.genesis !== genesis) {
        return code;
      }
    });
  }),
};
