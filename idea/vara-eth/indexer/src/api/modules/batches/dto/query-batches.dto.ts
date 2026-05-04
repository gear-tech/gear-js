import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import { PaginatedBlockRangeDTO } from '../../../common/dto/range.dto.js';

export class QueryBatchesDto extends PaginatedBlockRangeDTO {
  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['committedAt', 'committedAtBlock'],
    default: 'committedAt',
  })
  @IsOptional()
  @IsIn(['committedAt', 'committedAtBlock'])
  sortBy?: 'committedAt' | 'committedAtBlock' = 'committedAt';
}
