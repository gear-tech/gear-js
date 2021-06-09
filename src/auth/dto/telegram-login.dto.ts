import { ApiProperty } from '@nestjs/swagger';

export class TelegramLoginDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  photo_url: string;

  @ApiProperty()
  auth_date: string;

  @ApiProperty()
  hash: string;
}
