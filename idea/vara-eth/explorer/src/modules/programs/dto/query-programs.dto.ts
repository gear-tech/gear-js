import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PaginatedBlockRangeDTO } from '../../../common/dto/range.dto.js';

export class QueryProgramsDto extends PaginatedBlockRangeDTO {
  @ApiPropertyOptional({
    description: 'Filter by code ID (hex with 0x prefix)',
    example: '0x1234...',
  })
  @IsOptional()
  @IsString()
  codeId?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'blockNumber'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'blockNumber'])
  sortBy?: 'createdAt' | 'blockNumber' = 'createdAt';
}
