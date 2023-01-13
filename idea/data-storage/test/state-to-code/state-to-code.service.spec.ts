import { Test } from '@nestjs/testing';
import { Hex } from '@gear-js/api';

import { StateToCodeService } from '../../src/state-to-code/state-to-code.service';
import { mockStateToCodeRepository } from '../mock/state-to-code/state-to-code-repository.mock';
import { Code, State } from '../../src/database/entities';
import { StateToCodeRepo } from '../../src/state-to-code/state-to-code.repo';
import { STATE_TO_CODE_DB_MOCK } from '../mock/state-to-code/state-to-code-db.mock';

describe('StateToCode service', () => {
  let stateToCodeService!: StateToCodeService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: StateToCodeRepo,
          useFactory: () => mockStateToCodeRepository,
        },
        StateToCodeService,
      ],
    }).compile();

    stateToCodeService = moduleRef.get<StateToCodeService>(StateToCodeService);
  });

  it('should be successfully create stateToCode DB type', async () => {
    const code = new Code();
    code._id = '0x001';
    code.id = '0x001';
    const stateHex = 'some_hex' as Hex;
    const state = new State();
    state.id = '0x002';

    const stateToCode = await stateToCodeService.create(code, state, stateHex);

    expect(stateToCode.hexWasmState).toEqual(stateHex);
    expect(stateToCode.codeId).toEqual(code._id);
    expect(stateToCode.state.id).toEqual(state.id);
    expect(mockStateToCodeRepository.save).toHaveBeenCalled();
  });

  it('should be return true if exists code with stateHex', async () => {
    const stateToCodeInDB = STATE_TO_CODE_DB_MOCK[0];

    const res = await stateToCodeService.isExistStateHexByCode(
      stateToCodeInDB.hexWasmState as Hex,
      stateToCodeInDB.code.id,
    );

    expect(res).toEqual(true);
  });
});
