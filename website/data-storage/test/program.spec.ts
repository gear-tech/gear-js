import { Test } from '@nestjs/testing';

import { Program } from '../src/entities/program.entity';
import { ProgramService } from '../src/program/program.service';
import { ProgramRepo } from '../src/program/program.repo';
import { UpdateProgramDataInput } from '../src/program/types';
import { Meta } from '../dist/entities';
import { GetAllProgramsParams, GetAllUserProgramsParams, InitStatus } from '@gear-js/common';

const PROGRAM_ENTITY_ID = '0x7357';
const PROGRAM_GENESIS_ID = '0x73_57';
const PROGRAM_NAME = '0x73_58';
const PROGRAM_TITLE = '0x73_59';

describe('Programs Service', () => {
  let programsService!: ProgramService;
  const programs = [{ id: PROGRAM_ENTITY_ID, genesis: PROGRAM_GENESIS_ID }];

  const mockProgramRepository = {
    save: jest.fn().mockImplementation((program: Program): Promise<Program> => {
      return new Promise((resolve) => resolve(program));
    }),
    getByIdAndGenesis: jest.fn(() => ({ id: PROGRAM_ENTITY_ID })),
    getByIdAndGenesisAndOwner: jest.fn((params: GetAllUserProgramsParams) => {
      return [programs, params.limit];
    }),
    listByOwnerAndGenesis: jest.fn((params: GetAllUserProgramsParams) => {
      return [programs, params.limit];
    }),
    listPaginationByGenesis: jest.fn((params: GetAllProgramsParams) => {
      return [programs, params.limit];
    }),
    listByGenesis: jest.fn(() => {
      return programs;
    }),
    remove: jest.fn().mockImplementation((programsToDelete: Program[]): Promise<Program[]> => {
      return new Promise((resolve) => resolve(programsToDelete));
    }),
  };

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
    const meta: Meta = { id: 'meta', owner: 'owner' } as Meta;
    const updateProgramDataInput: UpdateProgramDataInput = {
      id: PROGRAM_ENTITY_ID,
      genesis: PROGRAM_GENESIS_ID,
      meta,
      name: PROGRAM_NAME,
      title: PROGRAM_TITLE,
    };
    const program = await programsService.updateProgramData(updateProgramDataInput);

    expect(program.id).toEqual(updateProgramDataInput.id);
    expect(program.name).toEqual(updateProgramDataInput.name);
    expect(program.title).toEqual(updateProgramDataInput.title);
    expect(program.meta).toEqual(updateProgramDataInput.meta);
  });

  it('should successfully get programs and called getAllUserProgram method', async () => {
    const getAllUserProgramParamsInput: GetAllUserProgramsParams = {
      genesis: PROGRAM_GENESIS_ID,
      offset: 1,
      limit: 1,
      owner: 'owner',
    };
    const result = await programsService.getAllUserPrograms(getAllUserProgramParamsInput);
    expect.arrayContaining(result.programs);
    expect(mockProgramRepository.listByOwnerAndGenesis).toHaveBeenCalled();
  });

  it('should successfully get programs and called listPaginationByGenesis method', async () => {
    const getAllProgramParamsInput: GetAllProgramsParams = {
      genesis: PROGRAM_GENESIS_ID,
      offset: 1,
      limit: 1,
      owner: 'owner',
    };
    const result = await programsService.getAllPrograms(getAllProgramParamsInput);
    expect.arrayContaining(result.programs);
    expect(mockProgramRepository.listPaginationByGenesis).toHaveBeenCalled();
  });

  it('should successfully update program status to PROGRESS', async () => {
    const updateProgramStatusInput = {
      id: PROGRAM_ENTITY_ID,
      genesis: PROGRAM_GENESIS_ID,
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
    const program_1 = new Program();
    program_1.id = PROGRAM_ENTITY_ID;
    program_1.genesis = PROGRAM_GENESIS_ID;
    const deleteProgram = await programsService.deleteRecords(program_1.genesis);
    expect(deleteProgram[0].genesis).toEqual(program_1.genesis);
    expect(mockProgramRepository.remove).toHaveBeenCalled();
  });
});
