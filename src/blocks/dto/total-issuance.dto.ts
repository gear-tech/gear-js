import { ApiProperty } from '@nestjs/swagger';

export class TotalIssuanceDto {
  @ApiProperty({ example: '100,241 MUnits' })
  totalIssuance: string;
}
