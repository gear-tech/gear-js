import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProgramResponseDto } from '../../programs/dto/program-response.dto.js';

export class ReplySentResponseDto {
  @ApiProperty({ description: 'Reply ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Replied-to message ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  repliedToId: string;

  @ApiProperty({ description: 'Source program ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  sourceProgramId: string;

  @ApiProperty({ description: 'Destination address (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  destination: string;

  @ApiProperty({ description: 'State transition ID (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  stateTransitionId: string;

  @ApiProperty({ description: 'Reply code', example: '0x0000' })
  @Expose()
  replyCode: string;

  @ApiProperty({ description: 'Whether this is a call reply' })
  @Expose()
  isCall: boolean;

  @ApiProperty({ description: 'Value transferred', example: '0' })
  @Expose()
  value: string;

  @ApiProperty({ description: 'Payload (hex with 0x prefix)', example: '0x1234...' })
  @Expose()
  payload: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: () => ProgramResponseDto, required: false })
  @Expose()
  @Type(() => ProgramResponseDto)
  sourceProgram?: ProgramResponseDto;
}
