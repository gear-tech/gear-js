import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockService } from './block.service';
import { BlockRepo } from './block.repo';
import { Block } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Block])],
  controllers: [],
  providers: [BlockService, BlockRepo],
  exports: [BlockService],
})
export class BlockModule {}
