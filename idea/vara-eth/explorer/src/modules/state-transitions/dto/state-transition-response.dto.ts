import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BatchResponseDto } from '../../batches/dto/batch-response.dto.js';
import { ProgramResponseDto } from '../../programs/dto/program-response.dto.js';

export class StateTransitionResponseDto {
  @ApiProperty({ description: 'State transition ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'State transition hash (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  hash: string;

  @ApiProperty({ description: 'Program ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  programId: string;

  @ApiProperty({ description: 'Value to receive', example: '0', nullable: true })
  @Expose()
  valueToReceive: string | null;

  @ApiProperty({ description: 'State transition timestamp', example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  timestamp: Date;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Whether program has exited' })
  @Expose()
  exited: boolean;

  @ApiProperty({ description: 'Inheritor address (hex with 0x prefix)', example: '0x1234...', nullable: true })
  @Expose()
  inheritor: string | null;

  @ApiProperty({ type: () => ProgramResponseDto, required: false })
  @Expose()
  @Type(() => ProgramResponseDto)
  program?: ProgramResponseDto;

  @ApiProperty({ type: () => BatchResponseDto, required: false })
  @Expose()
  @Type(() => BatchResponseDto)
  batch?: BatchResponseDto;
}
