import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BatchesService } from './batches.service.js';
import type { QueryBatchesDto } from './dto/query-batches.dto.js';

@ApiTags('batches')
@Controller('batches')
@UseGuards(ThrottlerGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of batches' })
  async findAll(@Query() query: QueryBatchesDto) {
    return this.batchesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get batch by ID' })
  @ApiParam({ name: 'id', description: 'Batch ID (hex with 0x prefix)' })
  @ApiResponse({ status: 200, description: 'Returns the batch' })
  @ApiResponse({ status: 404, description: 'Batch not found' })
  async findOne(@Param('id') id: string) {
    return this.batchesService.findOne(id);
  }
}
