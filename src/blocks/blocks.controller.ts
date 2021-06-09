import { Controller, Get, Sse, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlocksService } from './blocks.service';
import { TotalIssuanceDto } from './dto/total-issuance.dto';

@ApiTags('blocks')
@ApiBearerAuth()
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
  @ApiOkResponse({ type: TotalIssuanceDto, status: 200 })
  totalIssuance() {
    return this.blocksService.totalIssuance();
  }
}
