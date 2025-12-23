import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryBatchesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['commitedAt', 'commitedAtBlock'],
    default: 'commitedAt',
  })
  @IsOptional()
  @IsIn(['commitedAt', 'commitedAtBlock'])
  sortBy?: 'commitedAt' | 'commitedAtBlock' = 'commitedAt';

  @ApiPropertyOptional({
    description: 'Start block number (inclusive)',
    type: Number,
  })
  @IsOptional()
  fromBlock?: number;

  @ApiPropertyOptional({
    description: 'End block number (inclusive)',
    type: Number,
  })
  @IsOptional()
  toBlock?: number;
}
