import { Test } from '@nestjs/testing';

import { BlockRepo } from '../../src/block/block.repo';
import { mockBlockRepository } from '../mock/block/block-repository.mock';
import { BlockService } from '../../src/block/block.service';
import { CreateBlockInput } from '../../src/block/types/create-block.input';
import { BLOCK_DB_MOCK } from '../mock/block/block-db.mock';

describe('Block service', () => {
  let blockService!: BlockService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BlockRepo,
          useFactory: () => mockBlockRepository,
        },
        BlockService,
      ],
    }).compile();

    blockService = moduleRef.get<BlockService>(BlockService);
  });

  it('should be successfully create block entity', async () => {
    const createBlockInput: CreateBlockInput = {
      timestamp: new Date() as any,
      hash: '0x0000000000000000',
      numberBlockInNode: '1'
    };

    const blocks = await blockService.createBlocks([createBlockInput]);

    expect(blocks[0].timestamp).toEqual(createBlockInput.timestamp);
    expect(blocks[0].hash).toEqual(createBlockInput.hash);
    expect(blocks[0].number).toEqual(createBlockInput.numberBlockInNode);
    expect(mockBlockRepository.save).toHaveBeenCalled();
  });

  it('should be successfully get last block from block table', async () => {
    const dates = BLOCK_DB_MOCK.map(block => block.timestamp);
    const maxDate = new Date(Math.max(...dates as any));

    const lastBlock = await blockService.getLastBlock();

    expect(lastBlock.timestamp).toEqual(maxDate);
    expect(mockBlockRepository.getLastBlock).toHaveBeenCalled();
  });
});
