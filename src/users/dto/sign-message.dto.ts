import { ApiProperty } from '@nestjs/swagger';

export class SignMessageDto {
  @ApiProperty({
    example:
      'merge essay canyon hungry direct fragile kiss void found first curve guilt',
  })
  mnemonic: string;

  @ApiProperty({ example: 'message for signing' })
  message: string;
}
