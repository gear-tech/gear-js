import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate, signatureVerify } from '@polkadot/util-crypto';
import { stringToU8a } from '@polkadot/util';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAll() {
    return this.userRepository.find();
  }

  getPair(userId, mnemonic) {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
    const pair = keyring.addFromUri(
      `${mnemonic}//${userId}`,
      { name: 'key pair' },
      'ed25519',
    );
    return pair;
  }

  createKeyPair(user: User) {
    const mnemonic = mnemonicGenerate();
    const pair = this.getPair(user.id, mnemonic);
    user.publicKey = pair.address;

    return {
      mnemonic: mnemonic,
      name: pair.meta.name,
      public: pair.address,
    };
  }

  signMessage(userId, message: string, mnemonic: string) {
    const pair = this.getPair(userId, mnemonic);

    const signature = pair.sign(stringToU8a(message));
    if (signatureVerify(message, signature, pair.address).isValid) {
      return {
        result: 'success',
      };
    }
    return {
      result: 'failed',
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      return false;
    }
    return user;
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
}
