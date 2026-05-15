import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TransactionDetailResponseDto {
  @ApiProperty({
    description: 'Transaction hash (hex with 0x prefix)',
    example: '0x1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Contract address (hex with 0x prefix)',
    example: '0x1234567890abcdef',
  })
  @Expose()
  contractAddress: string;

  @ApiProperty({
    description: 'Function selector',
    example: '0x12345678',
  })
  @Expose()
  selector: string;

  @ApiProperty({
    description: 'Transaction data payload (hex with 0x prefix)',
    example: '0xdeadbeef',
  })
  @Expose()
  data: string;

  @ApiProperty({
    description: 'Sender address (hex with 0x prefix)',
    example: '0x1234567890abcdef',
  })
  @Expose()
  sender: string;

  @ApiProperty({
    description: 'Block number',
    example: '1000',
  })
  @Expose()
  blockNumber: string;

  @ApiProperty({
    description: 'Transaction creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}
