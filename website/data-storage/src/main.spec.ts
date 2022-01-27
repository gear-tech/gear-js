import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Program } from './entities/program.entity';
import { ProgramsService } from './programs/programs.service';

describe('Programs Service', () => {
  let programsService!: ProgramsService;

  const Repository_create = jest.fn(() => ({ id: 7357 }));
  const Repository_save = jest.fn(async () => ({ id: 7357 }));

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        // Stub programs repo implementation:
        {
          provide: getRepositoryToken(Program),
          useValue: {
            create: Repository_create,
            save: Repository_save,
          },
        },
        // And use the default Programs service as it is:
        ProgramsService,
      ],
    }).compile();

    programsService = moduleRef.get(ProgramsService);
  });

  afterEach(() => {
    Repository_create.mockReset();
    Repository_save.mockReset();
  });

  it('should record uploaded program', async () => {
    // Given an initialized Programs Service,
    // when:
    programsService.save({
      id: 7357,
      genesis: '0x07357',
      owner: '0x7357',
      uploadedAt: 0,
    });

    // then:
    expect(Repository_create).toHaveBeenCalled();
    expect(Repository_save).toHaveBeenCalled();
  });
});
