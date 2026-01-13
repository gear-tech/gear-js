import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TransactionsService } from './transactions.service.js';
import { QueryTransactionsDto } from './dto/query-transactions.dto.js';
import { TransactionListResponseDto } from './dto/transaction-list-response.dto.js';
import { TransactionDetailResponseDto } from './dto/transaction-detail-response.dto.js';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(ThrottlerGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Ethereum transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of transactions (without data field)',
    type: TransactionListResponseDto,
    isArray: true,
  })
  async findAll(@Query() query: QueryTransactionsDto) {
    return this.transactionsService.findAll(query);
  }

  @Get(':hash')
  @ApiOperation({ summary: 'Get transaction by hash' })
  @ApiParam({ name: 'hash', description: 'Transaction hash (hex with 0x prefix)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the transaction with full details including data field',
    type: TransactionDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('hash') hash: string) {
    return this.transactionsService.findOne(hash);
  }
}
