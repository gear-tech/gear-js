import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CodeResponseDto } from '../../codes/dto/code-response.dto.js';

export class ProgramResponseDto {
  @ApiProperty({
    description: 'Program ID (hex with 0x prefix)',
    example: '0x1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Related code entity',
    type: () => CodeResponseDto,
    required: false,
  })
  @Expose()
  @Type(() => CodeResponseDto)
  code?: CodeResponseDto;

  @ApiProperty({
    description: 'Block number when program was created',
    example: '1000',
  })
  @Expose()
  blockNumber: string;

  @ApiProperty({
    description: 'Transaction hash (hex with 0x prefix)',
    example: '0x1234567890abcdef',
  })
  @Expose()
  txHash: string;

  @ApiProperty({
    description: 'ABI interface address (hex with 0x prefix)',
    example: '0x1234567890abcdef',
    required: false,
    nullable: true,
  })
  @Expose()
  abiInterfaceAddress?: string | null;

  @ApiProperty({
    description: 'Program creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}
