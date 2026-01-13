import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LookupService } from './lookup.service.js';

@ApiTags('lookup')
@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Get(':hash')
  @ApiOperation({ summary: 'Lookup entity by hash' })
  @ApiParam({ name: 'hash', description: 'Hash to lookup (0x-prefixed hex string)' })
  @ApiResponse({ status: 200, description: 'Returns the entity data with its type' })
  @ApiResponse({ status: 404, description: 'Hash not found' })
  async lookupByHash(@Param('hash') hash: string) {
    return this.lookupService.lookupByHash(hash);
  }
}
