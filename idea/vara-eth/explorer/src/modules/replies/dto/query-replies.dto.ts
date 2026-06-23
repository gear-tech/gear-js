import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto.js';
import { TransformToBytea } from '../../../common/utils/hex.util.js';

export class QueryRepliesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by program ID',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  programId?: PgByteaString;

  @ApiPropertyOptional({
    description: 'Filter by replied to message ID (for sent replies)',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  repliedToId?: PgByteaString;
}
