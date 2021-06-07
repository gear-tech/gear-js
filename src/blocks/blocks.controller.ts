import { Controller, Get, Sse, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @UseGuards(JwtAuthGuard)
  @Sse('last')
  lastBlocks() {
    return this.blocksService.subscribeNewHeads();
  }

  @UseGuards(JwtAuthGuard)
  @Get('total')
  totalIssuance() {
    return this.blocksService.totalIssuance();
  }
}
