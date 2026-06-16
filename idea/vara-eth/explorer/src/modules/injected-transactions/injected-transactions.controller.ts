/** biome-ignore-all lint/style/useImportType: NestJS emitDecoratorMetadata requires runtime class references for DI */
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';

import { ParseByteaPipe } from '../../common/pipes/parse-bytea.pipe.js';
import { InjectedTransactionResponseDto } from './dto/injected-transaction-response.dto.js';
import { QueryInjectedTransactionsDto } from './dto/query-injected-transactions.dto.js';
import { InjectedTransactionsService } from './injected-transactions.service.js';

@ApiTags('injected-transactions')
@Controller('injected-transactions')
@UseGuards(ThrottlerGuard)
export class InjectedTransactionsController {
  constructor(private readonly injectedTransactionsService: InjectedTransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all injected transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of injected transactions',
    type: InjectedTransactionResponseDto,
    isArray: true,
  })
  async findAll(@Query() query: QueryInjectedTransactionsDto) {
    return this.injectedTransactionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get injected transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID (hex with 0x prefix)' })
  @ApiResponse({ status: 200, description: 'Returns the injected transaction', type: InjectedTransactionResponseDto })
  @ApiResponse({ status: 404, description: 'Injected transaction not found' })
  async findOne(@Param('id', ParseByteaPipe) id: PgByteaString) {
    return this.injectedTransactionsService.findOne(id);
  }
}
