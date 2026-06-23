import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';
import { IsOptional, IsString } from 'class-validator';

import { PaginatedBlockRangeDTO } from '../../../common/dto/range.dto.js';
import { TransformToBytea } from '../../../common/utils/hex.util.js';

export class QueryProgramsDto extends PaginatedBlockRangeDTO {
  @ApiPropertyOptional({
    description: 'Filter by code ID (hex with 0x prefix)',
    example: '0x1234...',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  codeId?: PgByteaString;
}
