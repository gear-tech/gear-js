import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { State, Code, Program, StateToCode } from '../../../src/database/entities';

const code = new Code();
code.id = '0x001';

const mockProgramForState = new Program();
mockProgramForState.id = '0x001';
mockProgramForState.code = code;

const mockStateToCodeForState = new StateToCode();
mockStateToCodeForState.code = code;

function getStateDBMock(): State[] {
  const pathStates = '/states.mock.yaml';
  try {
    const states = load(readFileSync(__dirname + pathStates, 'utf8')) as State[];
    return states.map((state) => ({ ...state, stateToCodes: [mockStateToCodeForState] }));
  } catch (err) {
    console.error(err);
  }
}

const STATE_DB_MOCK = getStateDBMock();

export { STATE_DB_MOCK, mockProgramForState, mockStateToCodeForState };
