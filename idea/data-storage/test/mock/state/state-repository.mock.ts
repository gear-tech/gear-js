import { State } from '../../../src/database/entities';
import { STATE_DB_MOCK } from './state-db.mock';
import { PAGINATION_LIMIT } from '../../../src/common/constants';

export const mockStataRepository = {
  save: jest.fn().mockImplementation((state: State): Promise<State> => {
    return new Promise((resolve) => resolve(state));
  }),
  get: jest.fn((id: string) => {
    return STATE_DB_MOCK.find((state) => {
      if (id === state.id) {
        return state;
      }
    });
  }),
  list: jest.fn((codeId: string, query: string) => {
    const states = STATE_DB_MOCK.filter((state) => {
      if (codeId === state.code.id) {
        return state;
      }
      if (codeId === state.code.id && state.funcNames.includes(query)) {
        return state;
      }
    });
    return [states, PAGINATION_LIMIT];
  }),
};
