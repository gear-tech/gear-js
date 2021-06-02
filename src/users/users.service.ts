import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneTg(telegramId: string) {
    const user = await this.userRepository.findOne({ telegramId: telegramId });

    if (!user) {
      return false;
    }
    return user;
  }

  async createTg(userData: any) {
    if (await this.findOneTg(userData.telegramId)) {
      return await this.updateTg(userData);
    }
    return this.userRepository.save(userData);
  }

  async updateTg(userData: any) {
    const user = await this.userRepository.preload({
      telegramId: +userData.telegramId,
      ...userData,
    });
    if (!user) {
      throw new NotFoundException(`User ${userData.username} is not found`);
    }
    return this.userRepository.save(user);
  }
}
