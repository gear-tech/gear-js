import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Block } from '../database/entities';

@Injectable()
export class BlockRepo {
  constructor(
    @InjectRepository(Block)
    private blockRepo: Repository<Block>,
  ) {}

  public async getLastBlock(): Promise<Block[]> {
    return this.blockRepo.find({
      order: {
        timestamp: 'DESC',
      },
      take: 1
    });
  }

  public async save(blocks: Block[]): Promise<Block[]> {
    return this.blockRepo.save(blocks);
  }
}
