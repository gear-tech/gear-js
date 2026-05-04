import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { CodeStatus } from '../../../../model/entities/code.js';

export class CodeResponseDto {
  @ApiProperty({
    description: 'Code ID (hex with 0x prefix)',
    example: '0x1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Code validation status',
    enum: CodeStatus,
    enumName: 'CodeStatus',
    example: 'ValidationRequested',
  })
  @Expose()
  @Transform(({ value }) => (typeof value === 'number' ? CodeStatus[value] : value))
  status: string;

  @ApiProperty({
    description: 'Code creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}
