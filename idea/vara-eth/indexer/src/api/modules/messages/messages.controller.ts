import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MessagesService } from './messages.service.js';
import { QueryMessagesDto } from './dto/query-messages.dto.js';

@ApiTags('messages')
@Controller('messages')
@UseGuards(ThrottlerGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('requests')
  @ApiOperation({ summary: 'Get all message requests (user to program)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of message requests' })
  async findAllRequests(@Query() query: QueryMessagesDto) {
    return this.messagesService.findAllRequests(query);
  }

  @Get('sent')
  @ApiOperation({ summary: 'Get all sent messages (program to user/program)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of sent messages' })
  async findAllSent(@Query() query: QueryMessagesDto) {
    return this.messagesService.findAllSent(query);
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get message request by ID' })
  @ApiParam({ name: 'id', description: 'Message ID (hex with 0x prefix)' })
  @ApiResponse({ status: 200, description: 'Returns the message request' })
  @ApiResponse({ status: 404, description: 'Message request not found' })
  async findOneRequest(@Param('id') id: string) {
    return this.messagesService.findOneRequest(id);
  }

  @Get('sent/:id')
  @ApiOperation({ summary: 'Get sent message by ID' })
  @ApiParam({ name: 'id', description: 'Message ID (hex with 0x prefix)' })
  @ApiResponse({ status: 200, description: 'Returns the sent message' })
  @ApiResponse({ status: 404, description: 'Sent message not found' })
  async findOneSent(@Param('id') id: string) {
    return this.messagesService.findOneSent(id);
  }
}
