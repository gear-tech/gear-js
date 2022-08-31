import { Injectable } from "@nestjs/common";

import { UserRepo } from "./user.repo";
import { Role } from "../common/enums";
import { CreateUserInput } from "./types";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepo) {}

  async creatUser(createUserInput: CreateUserInput): Promise<User> {
    const { id, role } = createUserInput;
    return this.userRepository.save({ id, role });
  }

  async validate(userId: string): Promise<boolean> {
    const user = await this.userRepository.get(userId);

    return !!user;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userRepository.get(userId);

    return user.role === Role.ADMIN;
  }
}
