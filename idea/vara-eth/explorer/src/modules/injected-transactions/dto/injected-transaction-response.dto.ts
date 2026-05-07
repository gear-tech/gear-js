import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class InjectedTransactionResponseDto {
  @ApiProperty({ description: 'Transaction ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Reply ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  replyId: string;

  @ApiProperty({ description: 'Destination address (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  destination: string;

  @ApiProperty({ description: 'Sender address (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  senderAddress: string;

  @ApiProperty({ description: 'Reference block hash (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  referenceBlock: string;

  @ApiProperty({ description: 'Salt (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  salt: string;

  @ApiProperty({ description: 'Signature (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  signature: string;

  @ApiProperty({ description: 'Value transferred', example: '0' })
  @Expose()
  value: string;

  @ApiProperty({ description: 'Payload (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  payload: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;
}
