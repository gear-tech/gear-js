import { GetAllCodeParams } from '@gear-js/common';

import { Code } from '../../../database/entities';
import { CODE_DB_MOCK } from './code-db.mock';
import { UpdateCodeInput } from '../../../code/types';

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
  listPaginationByGenesis: jest.fn((params: GetAllCodeParams) => {
    const { genesis, limit } = params;
    const listCode = CODE_DB_MOCK.filter((code) => {
      if (code.genesis === genesis) {
        return code;
      }
    });
    return [listCode, limit];
  }),
  save: jest.fn().mockImplementation((code: Code): Promise<Code> => {
    return new Promise((resolve) => resolve(code));
  }),

  update: jest.fn().mockImplementation((codeEntityDB: Code, updateCodeInput: UpdateCodeInput): Promise<Code> => {
    const { id, genesis } = codeEntityDB;
    let updateCodeEntityDB;
    CODE_DB_MOCK.map((code) => {
      if (code.id === id || code.genesis === genesis) {
        const updateCode = { ...code, ...updateCodeInput };
        updateCodeEntityDB = updateCode;
        return updateCode;
      }
      return code;
    });

    return new Promise((resolve) => resolve(updateCodeEntityDB));
  }),
  removeByGenesis: jest.fn().mockImplementation((genesis: string): Code[] => {
    return CODE_DB_MOCK.filter((code) => {
      if (code.genesis !== genesis) {
        return code;
      }
    });
  }),
};
