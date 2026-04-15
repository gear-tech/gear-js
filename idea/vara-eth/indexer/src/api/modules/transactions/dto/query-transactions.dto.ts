import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryTransactionsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by function selector',
    example: '0x12345678',
  })
  @IsOptional()
  @IsString()
  selector?: string;

  @ApiPropertyOptional({
    description: 'Filter by sender address (hex with 0x prefix)',
  })
  @IsOptional()
  @IsString()
  sender?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'blockNumber'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'blockNumber'])
  sortBy?: 'createdAt' | 'blockNumber' = 'createdAt';

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
