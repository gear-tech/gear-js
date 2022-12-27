import { Test } from '@nestjs/testing';
import { AddStateParams, GetAllStateParams, GetStateParams } from '@gear-js/common';

import { StateService } from '../../src/state/state.service';
import { mockStataRepository } from '../mock/state/state-repository.mock';
import { ProgramRepo } from '../../src/program/program.repo';
import { StateRepo } from '../../src/state/state.repo';
import { mockProgramForState, STATE_DB_MOCK } from '../mock/state/state-db.mock';

describe('State service', () => {
  let stateService!: StateService;
  const mockProgramRepository = {
    get: jest.fn((id: string, genesis: string) => mockProgramForState),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: StateRepo,
          useFactory: () => mockStataRepository,
        },
        {
          provide: ProgramRepo,
          useFactory: () => mockProgramRepository
        },
        StateService,
      ],
    }).compile();

    stateService = moduleRef.get<StateService>(StateService);
  });

  it('should be successfully create state entity', async () => {
    const addStateParams: AddStateParams = {
      genesis: '0x00',
      name: 'state_1',
      programId: 'some_program_id',
      wasmBuffBase64: 'state_wasmBuffBase64'
    };

    const res = await stateService.create(addStateParams);

    expect(res.status).toEqual('State added');
    expect(mockStataRepository.save).toHaveBeenCalled();
  });

  it('should be successfully get states', async () => {
    const getAllStateParams: GetAllStateParams = {
      genesis: '0x00',
      programId: mockProgramForState.id
    };

    const res = await stateService.listByProgramId(getAllStateParams);

    expect(res.states.length > 0).toEqual(true);
    expect(mockStataRepository.list).toHaveBeenCalled();
  });

  it('should be successfully get state by id', async () => {
    const mockStateInDB = STATE_DB_MOCK[0];
    const getStateParams: GetStateParams = {
      genesis: '0x00',
      id: mockStateInDB.id
    };

    const res = await stateService.get(getStateParams);

    expect(res.id).toEqual(getStateParams.id);
    expect(mockStataRepository.get).toHaveBeenCalled();
  });

  it('should be fail to get state by invalid state id', async () => {
    const getStateParams: GetStateParams = {
      genesis: '0x00',
      id: 'invalid_id'
    };

    await expect(stateService.get(getStateParams)).rejects.toThrowError();
  });
});
