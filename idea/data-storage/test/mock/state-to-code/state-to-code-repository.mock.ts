import { StateToCode } from '../../../src/database/entities';
import { STATE_TO_CODE_DB_MOCK } from './state-to-code-db.mock';

export const mockStateToCodeRepository = {
  save: jest.fn().mockImplementation((stateToCode: StateToCode): Promise<StateToCode> => {
    return new Promise((resolve) => resolve(stateToCode));
  }),
  getByCodeIdAndStateHex: jest.fn((codeId: string, stateHex: string) => {
    return STATE_TO_CODE_DB_MOCK.find((stateToCode) => {
      if (codeId === stateToCode.code.id && stateToCode.hexWasmState === stateHex) {
        return stateToCode;
      }
    });
  }),
};
