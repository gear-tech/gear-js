import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto.js';
import { TransformToBytea } from '../../../common/utils/hex.util.js';

export class QueryStateTransitionsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by program ID (hex with 0x prefix)',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  programId?: PgByteaString;

  @ApiPropertyOptional({
    description: 'Filter by batch hash (hex with 0x prefix)',
  })
  @IsOptional()
  @IsString()
  @TransformToBytea()
  batchHash?: PgByteaString;

  @ApiPropertyOptional({
    description: 'Filter by exited status',
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    return value === true || value === 'true';
  })
  @IsBoolean()
  exited?: boolean;
}
