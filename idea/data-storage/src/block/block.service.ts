import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BlockRepo } from './block.repo';
import { CreateBlockInput } from './types/create-block.input';
import { Block } from '../database/entities';

@Injectable()
export class BlockService {
  constructor(private blockRepository: BlockRepo) {}

  public async getLastBlock(): Promise<Block>{
    const blockList = await this.blockRepository.getLastBlock();

    return blockList[0];
  }

  public async createBlocks(createBlocksInput: CreateBlockInput[]): Promise<Block[]> {
    const createBlocksDBType = createBlocksInput.map(createBlockInput => {
      return plainToClass(Block, {
        ...createBlockInput,
        number: createBlockInput.numberBlockInNode,
        timestamp: new Date(createBlockInput.timestamp)
      });
    });

    return this.blockRepository.save(createBlocksDBType);
  }
}
