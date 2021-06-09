import { ApiProperty } from '@nestjs/swagger';

export class KeyPairDto {
  @ApiProperty({
    example:
      'merge essay canyon hungry direct fragile kiss void found first curve guilt',
    description: 'mnemonic prhase for sign messages',
  })
  mnemonic: string;

  @ApiProperty({ example: 'key pair', description: "key's name" })
  name: string;

  @ApiProperty({
    example: 'CjCsHFvLhpRGK1LQHnRFyzphgg2aXU6d1NtKa44YervrwKG',
    description: 'public key',
  })
  public: string;
}
