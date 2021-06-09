import { ApiProperty } from '@nestjs/swagger';

export class GithubLoginQueryDto {
  @ApiProperty()
  code: string;
}
