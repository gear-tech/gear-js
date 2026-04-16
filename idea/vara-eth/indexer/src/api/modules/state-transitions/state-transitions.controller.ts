/** biome-ignore-all lint/style/useImportType: NestJS emitDecoratorMetadata requires runtime class references for DI */
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { QueryStateTransitionsDto } from './dto/query-state-transitions.dto.js';
import { StateTransitionsService } from './state-transitions.service.js';

@ApiTags('state-transitions')
@Controller('state-transitions')
@UseGuards(ThrottlerGuard)
export class StateTransitionsController {
  constructor(private readonly stateTransitionsService: StateTransitionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all state transitions' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of state transitions' })
  async findAll(@Query() query: QueryStateTransitionsDto) {
    return this.stateTransitionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get state transition by ID' })
  @ApiParam({ name: 'id', description: 'State transition ID (hex with 0x prefix)' })
  @ApiResponse({ status: 200, description: 'Returns the state transition' })
  @ApiResponse({ status: 404, description: 'State transition not found' })
  async findOne(@Param('id') id: string) {
    return this.stateTransitionsService.findOne(id);
  }
}
