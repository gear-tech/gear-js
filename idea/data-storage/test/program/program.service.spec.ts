import { Test } from '@nestjs/testing';
import { GetAllProgramsParams, GetAllUserProgramsParams } from '@gear-js/common';

import { ProgramService } from '../../src/program/program.service';
import { ProgramRepo } from '../../src/program/program.repo';
import { CreateProgramInput } from '../../src/program/types';
import { ProgramStatus } from '../../src/common/enums';

import { mockProgramRepository } from '../mock/program/program-repository.mock';
import { PROGRAM_DB_MOCK } from '../mock/program/program-db.mock';
import { CODE_DB_MOCK } from '../mock/code/code-db.mock';

const PROGRAM_ENTITY_ID = '0x7357';

describe('Program service', () => {
  let programService!: ProgramService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ProgramRepo,
          useFactory: () => mockProgramRepository,
        },
        ProgramService,
      ],
    }).compile();

    programService = moduleRef.get<ProgramService>(ProgramService);
  });

  it('should be successfully created new program', async () => {
    const code = CODE_DB_MOCK[0];

    const createProgramInput: CreateProgramInput = {
      id: PROGRAM_ENTITY_ID,
      genesis: '0x07357',
      owner: '0x7357',
      blockHash: '0x1234',
      timestamp: 0,
      code,
    };
    const programs = await programService.createPrograms([createProgramInput]);

    expect(programs[0].id).toEqual(PROGRAM_ENTITY_ID);
    expect(mockProgramRepository.save).toHaveBeenCalled();
  });

  it('should successfully get programs by owner and called getAllPrograms method', async () => {
    const { genesis, owner } = PROGRAM_DB_MOCK[1];
    const getAllUserProgramParamsInput: GetAllUserProgramsParams = {
      genesis,
      offset: 1,
      limit: 1,
      owner,
    };
    const result = await programService.getAllPrograms(getAllUserProgramParamsInput);
    expect.arrayContaining(result.programs);
    expect(result.programs[0].owner).toEqual(owner);
    expect(result.programs[0].genesis).toEqual(genesis);
    expect(mockProgramRepository.list).toHaveBeenCalled();
  });

  it('should successfully get programs and called getAllPrograms method', async () => {
    const { genesis } = PROGRAM_DB_MOCK[2];
    const getAllProgramParamsInput: GetAllProgramsParams = {
      genesis,
      offset: 1,
      limit: 1,
    };
    const result = await programService.getAllPrograms(getAllProgramParamsInput);
    expect.arrayContaining(result.programs);
    expect(result.programs[0].genesis).toEqual(genesis);
    expect(mockProgramRepository.list).toHaveBeenCalled();
  });

  it('should successfully update program status to ACTIVE', async () => {
    const { id, genesis } = PROGRAM_DB_MOCK[2];
    const updateProgramStatusInput = {
      id,
      genesis,
      status: ProgramStatus.ACTIVE,
    };
    const program = await programService.setStatus(
      updateProgramStatusInput.id,
      updateProgramStatusInput.genesis,
      updateProgramStatusInput.status,
    );
    expect(program.status).toEqual(updateProgramStatusInput.status);
    expect(program.status).not.toEqual(ProgramStatus.TERMINATED);
    expect(program.status).not.toEqual(ProgramStatus.PAUSED);
    expect(mockProgramRepository.save).toHaveBeenCalled();
  });

  it('should successfully deleted programs', async () => {
    const programToDelete = PROGRAM_DB_MOCK[0];
    const deleteProgram = await programService.deleteRecords(programToDelete.genesis);
    expect(deleteProgram[0].genesis).toEqual(programToDelete.genesis);
    expect(mockProgramRepository.remove).toHaveBeenCalled();
  });
});
