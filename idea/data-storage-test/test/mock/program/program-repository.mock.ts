import { GetAllProgramsParams, GetAllUserProgramsParams } from '@gear-js/common';

import { Program } from '../../../src/database/entities';
import { PROGRAM_DB_MOCK } from './program-db.mock';

export const mockProgramRepository = {
  save: jest.fn().mockImplementation((program: Program): Promise<Program> => {
    return new Promise((resolve) => resolve(program));
  }),
  getByIdAndGenesis: jest.fn((id: string, genesis: string) => {
    return PROGRAM_DB_MOCK.find((program) => {
      if (id === program.id && genesis === program.genesis) {
        return program;
      }
    });
  }),
  getByIdAndGenesisAndOwner: jest.fn((id: string, genesis: string, owner: string) => {
    return PROGRAM_DB_MOCK.find((program) => {
      if (id === program.id && genesis === program.genesis && owner === program.owner) {
        return program;
      }
    });
  }),
  listByOwnerAndGenesis: jest.fn((params: GetAllUserProgramsParams) => {
    const { limit, genesis, owner } = params;
    const programs = PROGRAM_DB_MOCK.filter((program) => {
      if (program.owner === owner && program.genesis === genesis) {
        return program;
      }
    });
    return [programs, limit];
  }),
  listPaginationByGenesis: jest.fn((params: GetAllProgramsParams) => {
    const { limit, genesis } = params;
    const programs = PROGRAM_DB_MOCK.filter((program) => {
      if (program.genesis === genesis) {
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
