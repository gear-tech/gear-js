import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryBatchesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['committedAt', 'committedAtBlock'],
    default: 'committedAt',
  })
  @IsOptional()
  @IsIn(['committedAt', 'committedAtBlock'])
  sortBy?: 'committedAt' | 'committedAtBlock' = 'committedAt';

  @ApiPropertyOptional({
    description: 'Start block number (inclusive)',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fromBlock?: number;

  @ApiPropertyOptional({
    description: 'End block number (inclusive)',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  toBlock?: number;
}
