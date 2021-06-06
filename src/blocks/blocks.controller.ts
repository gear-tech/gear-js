import { Controller, Get, Sse } from '@nestjs/common';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Sse('last')
  lastBlocks() {
    return this.blocksService.subscribeNewHeads();
  }

  @Get('total')
  totalIssuance() {
    return this.blocksService.totalIssuance();
  }
}
