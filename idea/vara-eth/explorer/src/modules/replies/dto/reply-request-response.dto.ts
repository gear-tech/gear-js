import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProgramResponseDto } from '../../programs/dto/program-response.dto.js';

export class ReplyRequestResponseDto {
  @ApiProperty({ description: 'Reply ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Source address (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  sourceAddress: string;

  @ApiProperty({ description: 'Program ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  programId: string;

  @ApiProperty({ description: 'Transaction hash (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  txHash: string;

  @ApiProperty({ description: 'Value transferred', example: '0' })
  @Expose()
  value: string;

  @ApiProperty({ description: 'Block number', example: '1000' })
  @Expose()
  blockNumber: string;

  @ApiProperty({ description: 'Payload (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  payload: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: () => ProgramResponseDto, required: false })
  @Expose()
  @Type(() => ProgramResponseDto)
  program?: ProgramResponseDto;
}
