import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryStateTransitionsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by program ID (hex with 0x prefix)',
  })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({
    description: 'Filter by batch hash (hex with 0x prefix)',
  })
  @IsOptional()
  @IsString()
  batchHash?: string;

  @ApiPropertyOptional({
    description: 'Filter by exited status',
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  exited?: boolean;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['timestamp'],
    default: 'timestamp',
  })
  @IsOptional()
  @IsIn(['timestamp'])
  sortBy?: 'timestamp' = 'timestamp' as const;
}
