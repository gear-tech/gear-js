import { GetAllProgramsParams } from '@gear-js/common';

import { Program } from '../../../src/database/entities';
import { PROGRAM_DB_MOCK } from './program-db.mock';

export const mockProgramRepository = {
  save: jest.fn().mockImplementation((program: Program): Promise<Program> => {
    return new Promise((resolve) => resolve(program));
  }),
  getWithMetaAndMessages: jest.fn((id: string, genesis: string) => {
    return PROGRAM_DB_MOCK.find((program) => {
      if (id === program.id && genesis === program.genesis) {
        return program;
      }
    });
  }),
  getWithMeta: jest.fn((id: string, genesis: string) => {
    return PROGRAM_DB_MOCK.find((program) => {
      if (id === program.id && genesis === program.genesis) {
        return program;
      }
    });
  }),
  get: jest.fn((id: string, genesis: string) => {
    return PROGRAM_DB_MOCK.find((program) => {
      if (id === program.id && genesis === program.genesis) {
        return program;
      }
    });
  }),
  list: jest.fn((params: GetAllProgramsParams) => {
    const { limit, genesis, owner } = params;
    const programs = PROGRAM_DB_MOCK.filter((program) => {
      if (genesis && program.genesis === genesis) {
        return program;
      }
      if (genesis && owner && program.genesis === genesis && program.owner === owner) {
        return program;
      }
    });
    return [programs, limit];
  }),
  listByGenesis: jest.fn((genesis: string) => {
    return PROGRAM_DB_MOCK.filter((program) => {
      if (program.genesis === genesis) {
        return program;
      }
    });
  }),
  remove: jest.fn().mockImplementation((programsToDelete: Program[]): Promise<Program[]> => {
    return new Promise((resolve) => resolve(programsToDelete));
  }),
};
