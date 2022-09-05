import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  public async get(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
