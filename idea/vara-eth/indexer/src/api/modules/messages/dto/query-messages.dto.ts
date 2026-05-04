import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PaginatedBlockRangeDTO } from '../../../common/dto/range.dto.js';

export class QueryMessagesDto extends PaginatedBlockRangeDTO {
  @ApiPropertyOptional({
    description: 'Filter by program ID (source or destination)',
  })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({
    description: 'Filter by source address (for requests)',
  })
  @IsOptional()
  @IsString()
  sourceAddress?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'blockNumber'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'blockNumber'])
  sortBy?: 'createdAt' | 'blockNumber' = 'createdAt';
}
