import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isHex, isU8a, u8aToHex } from '@polkadot/util';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      return false;
    }
    return user;
  }

  async findOneByPublicKey(publicKey: string) {
    const user = await this.userRepository.findOne({ publicKey: publicKey });
    if (!user) {
      return null;
    }
    return user;
  }

  async profile(user) {
    if (!user) {
      return { error: 'user not found' };
    }
    const {
      id,
      telegramId,
      githubId,
      authDate,
      authKey,
      accessToken,
      ...result
    } = user;
    return result;
  }

  async findOneTg(telegramId: string) {
    const user = await this.userRepository.findOne({ telegramId: telegramId });

    if (!user) {
      return false;
    }
    return user;
  }

  async findOneGit(githubId: string) {
    const user = await this.userRepository.findOne({ githubId: githubId });

    if (!user) {
      return false;
    }
    return user;
  }

  async saveTgAcc(userData: any) {
    const u = await this.findOneTg(userData.telegramId);
    if (u) {
      const user = await this.userRepository.preload({
        id: u.id,
        ...userData,
      });
      return this.userRepository.save(user);
    } else {
      return this.userRepository.save(userData);
    }
  }

  async saveGitAcc(userData: any) {
    const u = await this.findOneGit(userData.githubId);
    if (u) {
      const user = await this.userRepository.preload({
        id: u.id,
        ...userData,
      });
      return this.userRepository.save(user);
    } else {
      return this.userRepository.save(userData);
    }
  }

  addPublicKey(user: User, pubKey, pubKeyRaw) {
    user.publicKey = pubKey;
    if (pubKeyRaw) {
      user.publicKeyRaw = isHex(pubKeyRaw)
        ? pubKeyRaw
        : isU8a(pubKeyRaw)
        ? u8aToHex(pubKeyRaw)
        : '';
    }
    return this.userRepository.save(user);
  }
}
