import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

import { PaginationDto } from './pagination.dto.js';

export class PaginatedBlockRangeDTO extends PaginationDto {
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
