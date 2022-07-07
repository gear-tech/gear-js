import { Test } from '@nestjs/testing';
import { CODE_STATUS, GetAllCodeParams, GetCodeParams } from '@gear-js/common';

import { Code } from '../../src/entities';
import { mockCodeRepository } from '../../src/common/mock/code/code-repository.mock';
import { CODE_DB_MOCK } from '../../src/common/mock/code/code-db.mock';
import { CodeRepo } from '../../src/code/code.repo';
import { CodeService } from '../../src/code/code.service';
import { UpdateCodeInput } from '../../src/code/types';
import { UpdateResult } from 'typeorm';

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
      status: CODE_STATUS.ACTIVE,
      expiration: 111,
    };

    const code = await codeService.updateCode(updateCodeInput);

    if (!(code instanceof UpdateResult)) {
      expect(code.id).toEqual(updateCodeInput.id);
      expect(code.status).toEqual(updateCodeInput.status);
    }
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
    expect(mockCodeRepository.listPaginationByGenesis).toHaveBeenCalled();
  });

  it('should be successfully get code entity and called getByIdAndGenesis method', async () => {
    const codeMock = CODE_DB_MOCK[0];

    const params: GetCodeParams = {
      genesis: codeMock.genesis,
      codeId: codeMock.id,
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
      codeId: invalidCodeEntity.id,
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
});
