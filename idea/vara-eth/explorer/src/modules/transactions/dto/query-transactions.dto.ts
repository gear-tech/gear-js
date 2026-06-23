import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';
import { IsOptional, IsString } from 'class-validator';

import { PaginatedBlockRangeDTO } from '../../../common/dto/range.dto.js';
import { TransformToBytea } from '../../../common/utils/hex.util.js';

export class QueryTransactionsDto extends PaginatedBlockRangeDTO {
  @ApiPropertyOptional({
    description: 'Filter by function selector',
    example: '0x12345678',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  selector?: PgByteaString;

  @ApiPropertyOptional({
    description: 'Filter by sender address (hex with 0x prefix)',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  sender?: PgByteaString;
}
