import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RepliesService } from './replies.service.js';
import { QueryRepliesDto } from './dto/query-replies.dto.js';

@ApiTags('replies')
@Controller('replies')
@UseGuards(ThrottlerGuard)
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Get('requests')
  @ApiOperation({ summary: 'Get all reply requests (user to program)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of reply requests' })
  async findAllRequests(@Query() query: QueryRepliesDto) {
    return this.repliesService.findAllRequests(query);
  }

  @Get('sent')
  @ApiOperation({ summary: 'Get all sent replies (program to user)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of sent replies' })
  async findAllSent(@Query() query: QueryRepliesDto) {
    return this.repliesService.findAllSent(query);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get reply request by ID' })
  @ApiParam({ name: 'id', description: 'Reply ID (hex with 0x prefix)' })
  @ApiResponse({ status: 200, description: 'Returns the reply request' })
  @ApiResponse({ status: 404, description: 'Reply request not found' })
  async findOneRequest(@Param('id') id: string) {
    return this.repliesService.findOneRequest(id);
  }

  @Get('sent/:id')
  @ApiOperation({ summary: 'Get sent reply by ID' })
  @ApiParam({ name: 'id', description: 'Reply ID (hex with 0x prefix)' })
  @ApiResponse({ status: 200, description: 'Returns the sent reply' })
  @ApiResponse({ status: 404, description: 'Sent reply not found' })
  async findOneSent(@Param('id') id: string) {
    return this.repliesService.findOneSent(id);
  }
}
