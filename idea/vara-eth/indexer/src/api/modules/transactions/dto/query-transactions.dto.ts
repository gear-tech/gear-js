import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
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
  fromBlock?: number;

  @ApiPropertyOptional({
    description: 'End block number (inclusive)',
    type: Number,
  })
  @IsOptional()
  toBlock?: number;
}
