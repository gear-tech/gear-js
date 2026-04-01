import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryMessagesDto extends PaginationDto {
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
