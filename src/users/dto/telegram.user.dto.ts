import { IsOptional, IsString } from 'class-validator';

export class TelegramUserDto {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly telegramId: string;

  @IsOptional()
  @IsString()
  readonly hash: string;

  @IsOptional()
  @IsString()
  readonly authDate: string;

  @IsOptional()
  @IsString()
  readonly photoUrl: string;
}
