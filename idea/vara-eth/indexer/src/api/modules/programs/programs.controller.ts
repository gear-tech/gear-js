import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ProgramsService } from './programs.service.js';
import { QueryProgramsWithBlockRangeDto } from './dto/query-programs.dto.js';
import { ProgramResponseDto } from './dto/program-response.dto.js';

@ApiTags('programs')
@Controller('programs')
@UseGuards(ThrottlerGuard)
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of programs',
    type: ProgramResponseDto,
    isArray: true,
  })
  async findAll(@Query() query: QueryProgramsWithBlockRangeDto) {
    return this.programsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID' })
  @ApiParam({ name: 'id', description: 'Program ID (hex with 0x prefix)', example: '0x1234...' })
  @ApiResponse({
    status: 200,
    description: 'Returns the program',
    type: ProgramResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Program not found' })
  async findOne(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }
}
