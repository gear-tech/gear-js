import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';

export class QueryCodesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by code status',
    enum: ['ValidationRequested', 'ValidationFailed', 'Validated'],
    example: 'Validated',
  })
  @IsOptional()
  @IsIn(['ValidationRequested', 'ValidationFailed', 'Validated'])
  status?: 'ValidationRequested' | 'ValidationFailed' | 'Validated';

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt'])
  sortBy?: 'createdAt' = 'createdAt' as const;
}
