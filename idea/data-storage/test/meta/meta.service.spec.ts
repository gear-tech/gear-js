import { Test } from '@nestjs/testing';
import { AddMetaParams, GetMetaByCodeParams } from '@gear-js/common';

import { ProgramRepo } from '../../src/program/program.repo';

import { mockProgramRepository } from '../mock/program/program-repository.mock';
import { PROGRAM_DB_MOCK } from '../mock/program/program-db.mock';
import { CodeRepo } from '../../src/code/code.repo';
import { mockCodeRepository } from '../mock/code/code-repository.mock';
import { MetaService } from '../../src/meta/meta.service';
import { MetaRepo } from '../../src/meta/meta.repo';
import { mockMetadataRepository } from '../mock/metadata/metadata-repository.mock';
import { METADATA_DB_MOCK } from '../mock/metadata/metadata-db.mock';


describe('Meta service', () => {
  let metaService!: MetaService;

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
          provide: CodeRepo,
          useFactory: () => mockCodeRepository,
        },
        MetaService,
      ],
    }).compile();

    metaService = moduleRef.get<MetaService>(MetaService);
  });

  it('should be successfully get meta by code id', async () => {
    const metaDB = METADATA_DB_MOCK[0];

    const getMetaByCodeParams: GetMetaByCodeParams = { genesis: '0x00', codeId: metaDB.code.id };

    const meta = await metaService.getByCodeId(getMetaByCodeParams);

    expect(meta.hash).toEqual(metaDB.hash);
    expect(meta.code.id).toEqual(metaDB.code.id);
    expect(mockMetadataRepository.getByCodeId).toHaveBeenCalled();
  });

  it('should be fail if code id invalid and call exception', async () => {
    const invalidCodeId = '_';

    const getMetaByCodeParams: GetMetaByCodeParams = { genesis: '0x00', codeId: invalidCodeId };


    await expect(metaService.getByCodeId(getMetaByCodeParams)).rejects.toThrowError();
    expect(mockMetadataRepository.getByCodeId).toHaveBeenCalled();
  });

  it('should successfully add metadata program', async () => {
    const mockProgram = PROGRAM_DB_MOCK[0];

    const addMetaParams: AddMetaParams = { name: 'name', genesis: mockProgram.genesis, programId: mockProgram.id, metaHex: 'hex' };

    const res = await metaService.addMeta(addMetaParams);


    expect(res.status).toEqual('Metadata added');
    expect(mockMetadataRepository.save).toHaveBeenCalled();
    expect(mockProgramRepository.save).toHaveBeenCalled();
  });

  it('should fail add metadata program if program id and genesis invalid', async () => {
    const invalidProgramId = '_';

    const addMetaParams: AddMetaParams = { name: 'name', genesis: '_', programId: invalidProgramId, metaHex: 'hex' };

    await expect(metaService.addMeta(addMetaParams)).rejects.toThrowError();
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
