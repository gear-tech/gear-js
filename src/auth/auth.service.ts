import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { createHash, createHmac } from 'crypto';
import { TelegramConstants } from './constants/telegram.constants';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  verifyTelegramLogin(hash: string, userData: object) {
    const botToken = TelegramConstants.botToken;
    const checkStr = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const keyHash = createHash('sha256').update(botToken).digest();
    const checkHash = createHmac('sha256', keyHash)
      .update(checkStr)
      .digest('hex');

    return hash === checkHash;
  }

  async loginTelegram(data: any) {
    const { hash, ...userData } = data;
    // if (!this.verifyTelegramLogin(hash, userData)){
    //     throw new BadRequestException('Incorrect Telegram data')
    // }
    const user = await this.userService.createTg({
      telegramId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      photoUrl: data.photo_url,
      authDate: data.auth_date,
      hash: data.hash,
    });

    return {
      access_token: this.jwtService.sign({
        username: user.username,
        id: user.id,
      }),
    };
  }
}
