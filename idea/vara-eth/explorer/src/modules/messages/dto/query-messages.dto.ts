import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';
import { IsOptional, IsString } from 'class-validator';

import { PaginatedBlockRangeDTO } from '../../../common/dto/range.dto.js';
import { TransformToBytea } from '../../../common/utils/hex.util.js';

export class QueryMessagesDto extends PaginatedBlockRangeDTO {
  @ApiPropertyOptional({
    description: 'Filter by program ID (source or destination)',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  programId?: PgByteaString;

  @ApiPropertyOptional({
    description: 'Filter by source address (for requests)',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  sourceAddress?: PgByteaString;
}
