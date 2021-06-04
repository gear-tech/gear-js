import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';

@Module({
  providers: [BlocksService],
  controllers: [BlocksController],
})
export class BlocksModule {}
