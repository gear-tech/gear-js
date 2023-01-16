import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { State, Code, Program, StateToCode } from '../../../src/database/entities';

const code = new Code();
code.id = '0x005';

const mockProgramForState = new Program();
mockProgramForState.id = '0x005';
mockProgramForState.code = code;

const newCode = new Code();
newCode.id = '0x001';

const mockProgramForState_EXIST = new Program();
mockProgramForState_EXIST.id = '0x001';
mockProgramForState_EXIST.code = newCode;

const mockStateToCodeForState = new StateToCode();
mockStateToCodeForState.code = code;
mockStateToCodeForState.stateHex = 'hex';

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

export { STATE_DB_MOCK, mockProgramForState, mockStateToCodeForState, mockProgramForState_EXIST };
