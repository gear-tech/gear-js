import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { StateTransitionsService } from './state-transitions.service.js';
import { QueryStateTransitionsDto } from './dto/query-state-transitions.dto.js';

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
