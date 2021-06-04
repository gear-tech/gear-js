import { Controller, Sse } from '@nestjs/common';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Sse('last')
  lastBlocks() {
    return this.blocksService.subscribeNewHeads();
  }
}
