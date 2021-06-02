import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
    
    @IsOptional()
    @IsString()
    readonly firstName: string;
    
    @IsOptional()
    @IsString()
    readonly lastName: string;

    @IsOptional()
    @IsString()
    readonly telegramId: string;

    @IsOptional()
    @IsString()
    readonly authKey: string;
    
    @IsOptional()
    @IsString()
    readonly authDate: string;


}
