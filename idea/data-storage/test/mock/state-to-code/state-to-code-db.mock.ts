import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Code, State, StateToCode } from '../../../src/database/entities';

const code = new Code();
code.id = '0x001';

const state = new State();
state.id = '0x002';

function getStateToCodeDBMock(): StateToCode[] {
  const pathStates = '/state-to-codes.mock.yaml';
  try {
    const stateToCodes = load(readFileSync(__dirname + pathStates, 'utf8')) as StateToCode[];
    return stateToCodes.map((stateToCodes) => ({
      ...stateToCodes,
      code,
      state,
      stateId: state.id,
      codeId: code.id,
    }));
  } catch (err) {
    console.error(err);
  }
}

const STATE_TO_CODE_DB_MOCK = getStateToCodeDBMock();

export { STATE_TO_CODE_DB_MOCK };
