import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto, BlockRangeDto } from '../../../common/dto/pagination.dto.js';

export class QueryProgramsDto extends PaginationDto {
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

export class QueryProgramsWithBlockRangeDto extends QueryProgramsDto {
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
