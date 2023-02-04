import { Test } from '@nestjs/testing';
import { AddMetaByCodeParams, AddMetaParams } from '@gear-js/common';

import { ProgramRepo } from '../../src/program/program.repo';

import { mockProgramRepository } from '../mock/program/program-repository.mock';
import { PROGRAM_DB_MOCK } from '../mock/program/program-db.mock';
import { CodeRepo } from '../../src/code/code.repo';
import { mockCodeRepository } from '../mock/code/code-repository.mock';
import { MetaService } from '../../src/meta/meta.service';
import { MetaRepo } from '../../src/meta/meta.repo';
import { mockMetadataRepository } from '../mock/metadata/metadata-repository.mock';
import { METADATA_DB_MOCK } from '../mock/metadata/metadata-db.mock';
import { GearEventListener } from '../../src/gear/gear-event-listener';
import { ProgramService } from '../../src/program/program.service';
import { CODE_DB_MOCK } from '../mock/code/code-db.mock';


describe('Meta service', () => {
  let metaService!: MetaService;
  const mockGearEventListener = {
    api: { program: { metaHash: () => '0x00' }, code: { metaHash: () => '0x00'  } }
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: MetaRepo,
          useFactory: () => mockMetadataRepository,
        },
        {
          provide: ProgramRepo,
          useFactory: () => mockProgramRepository,
        },
        {
          provide: GearEventListener,
          useFactory: () => mockGearEventListener
        },
        {
          provide: CodeRepo,
          useFactory: () => mockCodeRepository,
        },
        ProgramService,
        MetaService,
      ],
    }).compile();

    metaService = moduleRef.get<MetaService>(MetaService);
  });

  it('should successfully add metadata code', async () => {
    const mockProgram = CODE_DB_MOCK[0];

    const addMetaParams: AddMetaByCodeParams = {
      name: 'name',
      genesis: mockProgram.genesis,
      codeId: mockProgram.id,
      metaHex: 'hex',
    };

    const res = await metaService.addMetaByCode(addMetaParams);


    expect(res.status).toEqual('Metadata added');
    expect(mockMetadataRepository.save).toHaveBeenCalled();
    expect(mockCodeRepository.save).toHaveBeenCalled();
  });

  it('should successfully add metadata program', async () => {
    const mockProgram = PROGRAM_DB_MOCK[0];

    const addMetaParams: AddMetaParams = {
      name: 'name',
      genesis: mockProgram.genesis,
      programId: mockProgram.id,
      metaHex: 'hex',
    };

    const res = await metaService.addMetaByProgram(addMetaParams);


    expect(res.status).toEqual('Metadata added');
    expect(mockMetadataRepository.save).toHaveBeenCalled();
    expect(mockProgramRepository.save).toHaveBeenCalled();
  });

  it('should fail add metadata program if program id and genesis invalid', async () => {
    const invalidProgramId = '_';

    const addMetaParams: AddMetaParams = { name: 'name', genesis: '_', programId: invalidProgramId, metaHex: 'hex' };

    await expect(metaService.addMetaByProgram(addMetaParams)).rejects.toThrowError();
    expect(mockProgramRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should successfully get meta by hash', async () => {
    const metaDB = METADATA_DB_MOCK[0];

    const meta = await metaService.getByHash(metaDB.hash);

    expect(meta.hash).toEqual(metaDB.hash);
    expect(meta.code.id).toEqual(metaDB.code.id);
    expect(mockMetadataRepository.getByHash).toHaveBeenCalled();
  });

});
