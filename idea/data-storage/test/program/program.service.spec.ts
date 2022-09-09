import { Test } from '@nestjs/testing';
import { GetAllProgramsParams, GetAllUserProgramsParams } from '@gear-js/common';

import { ProgramService } from '../../src/program/program.service';
import { ProgramRepo } from '../../src/program/program.repo';
import { UpdateProgramDataInput } from '../../src/program/types';
import { ProgramStatus } from '../../src/common/enums';

import { mockProgramRepository } from '../mock/program/program-repository.mock';
import { PROGRAM_DB_MOCK } from '../mock/program/program-db.mock';

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
    const program = await programService.createProgram({
      id: PROGRAM_ENTITY_ID,
      genesis: '0x07357',
      owner: '0x7357',
      blockHash: '0x1234',
      timestamp: 0,
    });

    expect(program.id).toEqual(PROGRAM_ENTITY_ID);
    expect(mockProgramRepository.save).toHaveBeenCalled();
  });

  it('should be successfully updated program', async () => {
    const { id, genesis } = PROGRAM_DB_MOCK[0];
    const updateProgramDataInput: UpdateProgramDataInput = {
      id,
      genesis,
      name: 'newName',
      title: 'newTitle',
    };
    const program = await programService.updateProgramData(updateProgramDataInput);

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

    await expect(programService.updateProgramData(updateProgramDataInput)).rejects.toThrowError();
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
    const result = await programService.getAllUserPrograms(getAllUserProgramParamsInput);
    expect.arrayContaining(result.programs);
    expect(result.programs[0].owner).toEqual(owner);
    expect(result.programs[0].genesis).toEqual(genesis);
    expect(mockProgramRepository.listByOwnerAndGenesis).toHaveBeenCalled();
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
    expect(mockProgramRepository.listPaginationByGenesis).toHaveBeenCalled();
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
    expect(program.status).not.toEqual(ProgramStatus.INIT_FAILED);
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
