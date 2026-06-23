import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BatchResponseDto {
  @ApiProperty({ description: 'Batch ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Block hash (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  blockHash: string;

  @ApiProperty({ description: 'Previous committed batch hash (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  previousCommittedBatchHash: string;

  @ApiProperty({ description: 'Expiry block number', example: '1000' })
  @Expose()
  expiry: string;

  @ApiProperty({ description: 'Block timestamp (unix ms)', example: '1700000000000' })
  @Expose()
  blockTimestamp: string;

  @ApiProperty({ description: 'Block number when committed', example: '1000' })
  @Expose()
  committedAtBlock: string;

  @ApiProperty({ description: 'Committed at timestamp', example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  committedAt: Date;
}
