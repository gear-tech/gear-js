import { Test } from '@nestjs/testing';
import { GetAllCodeParams, GetCodeParams, GetMetaByCodeParams } from '@gear-js/common';

import { Code } from '../../src/database/entities';
import { mockCodeRepository } from '../mock/code/code-repository.mock';
import { CODE_DB_MOCK } from '../mock/code/code-db.mock';
import { CodeRepo } from '../../src/code/code.repo';
import { CodeService } from '../../src/code/code.service';
import { UpdateCodeInput } from '../../src/code/types';
import { CodeStatus } from '../../src/common/enums';

const CODE_ENTITY_ID = '0x7357';

describe('Code service', () => {
  let codeService!: CodeService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CodeRepo,
          useFactory: () => mockCodeRepository,
        },
        CodeService,
      ],
    }).compile();

    codeService = moduleRef.get<CodeService>(CodeService);
  });

  it('should be successfully create code entity', async () => {
    const updateCodeInput: UpdateCodeInput = {
      id: CODE_ENTITY_ID,
      genesis: '0x07357',
      timestamp: 0,
      blockHash: '0x0000000000000000',
      status: CodeStatus.ACTIVE,
      expiration: '111',
      uploadedBy: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
    };

    const codes = await codeService.updateCodes([updateCodeInput]);

    expect(codes[0].id).toEqual(updateCodeInput.id);
    expect(codes[0].status).toEqual(updateCodeInput.status);
    expect(codes[0].expiration).toEqual(updateCodeInput.expiration);
    expect(mockCodeRepository.save).toHaveBeenCalled();
  });

  it('should be successfully get list code and called listPaginationByGenesis method', async () => {
    const codeMock = CODE_DB_MOCK[0];

    const params: GetAllCodeParams = {
      genesis: codeMock.genesis,
      limit: 1,
    };

    const result = await codeService.getAllCode(params);

    expect(result.listCode[0].id).toEqual(codeMock.id);
    expect(result.listCode[0].expiration).toEqual(codeMock.expiration);
    expect(result.listCode[0].name).toEqual(codeMock.name);
    expect(mockCodeRepository.list).toHaveBeenCalled();
  });

  it('should be successfully get meta by code id', async () => {
    const codeDB = CODE_DB_MOCK[0];

    const getMetaByCodeParams: GetMetaByCodeParams = { genesis: codeDB.genesis, codeId: codeDB.id };

    const meta = await codeService.getMeta(getMetaByCodeParams);

    expect(meta.hash).toEqual(codeDB.meta.hash);
    expect(mockCodeRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should be fail if code id invalid and call exception', async () => {
    const invalidCodeId = '_';

    const getMetaByCodeParams: GetMetaByCodeParams = { genesis: '0x00', codeId: invalidCodeId };


    await expect(codeService.getMeta(getMetaByCodeParams)).rejects.toThrowError();
    expect(mockCodeRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should be successfully get code entity and called getByIdAndGenesis method', async () => {
    const codeMock = CODE_DB_MOCK[0];

    const params: GetCodeParams = {
      genesis: codeMock.genesis,
      id: codeMock.id,
    };

    const code = await codeService.getByIdAndGenesis(params);

    expect(code.id).toEqual(codeMock.id);
    expect(code.expiration).toEqual(codeMock.expiration);
    expect(code.name).toEqual(codeMock.name);
    expect(mockCodeRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should fail if code entity not found and called getByIdAndGenesis method', async () => {
    const invalidCodeEntity = new Code();
    invalidCodeEntity.id = CODE_ENTITY_ID;
    invalidCodeEntity.genesis = 'some_genesis';

    const params: GetCodeParams = {
      id: invalidCodeEntity.id,
      genesis: invalidCodeEntity.genesis,
    };

    await expect(codeService.getByIdAndGenesis(params)).rejects.toThrowError();
    expect(mockCodeRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should be successfully deleted code entity and called remove method', async () => {
    const codeMock = CODE_DB_MOCK[2];

    await codeService.deleteRecords(codeMock.genesis);
    expect(mockCodeRepository.removeByGenesis).toHaveBeenCalled();
  });

  it('should be successfully deleted code entity and called remove method', async () => {
    const codeMock = CODE_DB_MOCK[2];

    await codeService.deleteRecords(codeMock.genesis);
    expect(mockCodeRepository.removeByGenesis).toHaveBeenCalled();
  });
});
