import { Test } from '@nestjs/testing';

import { ProgramService } from '../../src/program/program.service';
import { ProgramRepo } from '../../src/program/program.repo';
import { UpdateProgramDataInput } from '../../src/program/types';
import { GetAllProgramsParams, GetAllUserProgramsParams, InitStatus } from '@gear-js/common';

import { mockProgramRepository } from '../../src/common/mock/program/program-repository.mock';
import { PROGRAM_DB_MOCK } from '../../src/common/mock/program/program-db.mock';

const PROGRAM_ENTITY_ID = '0x7357';

describe('Program service', () => {
  let programsService!: ProgramService;

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

    programsService = moduleRef.get<ProgramService>(ProgramService);
  });

  it('should be successfully create new program', async () => {
    const program = await programsService.createProgram({
      id: PROGRAM_ENTITY_ID,
      genesis: '0x07357',
      owner: '0x7357',
      blockHash: '0x1234',
      timestamp: 0,
    });

    expect(program.id).toEqual(PROGRAM_ENTITY_ID);
    expect(mockProgramRepository.save).toHaveBeenCalled();
  });

  it('should be successfully update program', async () => {
    const { id, genesis } = PROGRAM_DB_MOCK[0];
    const updateProgramDataInput: UpdateProgramDataInput = {
      id,
      genesis,
      name: 'newName',
      title: 'newTitle',
    };
    const program = await programsService.updateProgramData(updateProgramDataInput);

    expect(program.id).toEqual(updateProgramDataInput.id);
    expect(program.name).toEqual(updateProgramDataInput.name);
    expect(program.title).toEqual(updateProgramDataInput.title);
    expect(program.meta).toEqual(updateProgramDataInput.meta);
  });

  it('should be get not found program exception', async () => {
    const updateProgramDataInput: UpdateProgramDataInput = {
      id: 'not_exist',
      genesis: 'not_exist',
      name: 'newName',
      title: 'newTitle',
    };

    await expect(programsService.updateProgramData(updateProgramDataInput)).rejects.toThrowError();
    expect(mockProgramRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should successfully get programs and called getAllUserProgram method', async () => {
    const { genesis, owner } = PROGRAM_DB_MOCK[1];
    const getAllUserProgramParamsInput: GetAllUserProgramsParams = {
      genesis,
      offset: 1,
      limit: 1,
      owner,
    };
    const result = await programsService.getAllUserPrograms(getAllUserProgramParamsInput);
    expect.arrayContaining(result.programs);
    expect(result.programs[0].owner).toEqual(owner);
    expect(result.programs[0].genesis).toEqual(genesis);
    expect(mockProgramRepository.listByOwnerAndGenesis).toHaveBeenCalled();
  });

  it('should successfully get programs and called listPaginationByGenesis method', async () => {
    const { genesis } = PROGRAM_DB_MOCK[2];
    const getAllProgramParamsInput: GetAllProgramsParams = {
      genesis,
      offset: 1,
      limit: 1,
    };
    const result = await programsService.getAllPrograms(getAllProgramParamsInput);
    expect.arrayContaining(result.programs);
    expect(result.programs[0].genesis).toEqual(genesis);
    expect(mockProgramRepository.listPaginationByGenesis).toHaveBeenCalled();
  });

  it('should successfully update program status to PROGRESS', async () => {
    const { id, genesis } = PROGRAM_DB_MOCK[2];
    const updateProgramStatusInput = {
      id,
      genesis,
      status: InitStatus.PROGRESS,
    };
    const program = await programsService.setStatus(
      updateProgramStatusInput.id,
      updateProgramStatusInput.genesis,
      updateProgramStatusInput.status,
    );
    expect(program.initStatus).toEqual(updateProgramStatusInput.status);
    expect(program.initStatus).not.toEqual(InitStatus.SUCCESS);
    expect(program.initStatus).not.toEqual(InitStatus.FAILED);
    expect(mockProgramRepository.save).toHaveBeenCalled();
  });

  it('should successfully deleted programs', async () => {
    const programToDelete = PROGRAM_DB_MOCK[0];
    const deleteProgram = await programsService.deleteRecords(programToDelete.genesis);
    expect(deleteProgram[0].genesis).toEqual(programToDelete.genesis);
    expect(mockProgramRepository.remove).toHaveBeenCalled();
  });
});
