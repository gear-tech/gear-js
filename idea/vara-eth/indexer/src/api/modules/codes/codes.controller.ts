import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CodesService } from './codes.service.js';
import { QueryCodesDto } from './dto/query-codes.dto.js';
import { CodeResponseDto } from './dto/code-response.dto.js';

@ApiTags('codes')
@Controller('codes')
@UseGuards(ThrottlerGuard)
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all codes' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of codes',
    type: CodeResponseDto,
    isArray: true,
  })
  async findAll(@Query() query: QueryCodesDto) {
    return this.codesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get code by ID' })
  @ApiParam({ name: 'id', description: 'Code ID (hex with 0x prefix)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the code',
    type: CodeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Code not found' })
  async findOne(@Param('id') id: string) {
    return this.codesService.findOne(id);
  }
}
