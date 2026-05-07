import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto.js';
import { TransformToBytea } from '../../../common/utils/hex.util.js';

export class QueryInjectedTransactionsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by destination address (hex with 0x prefix)' })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  destination?: PgByteaString;

  @ApiPropertyOptional({ description: 'Filter by sender address (hex with 0x prefix)' })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  senderAddress?: PgByteaString;
}
