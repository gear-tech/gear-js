import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { UserRepo } from "./user.repo";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserService, UserRepo],
  exports: [UserService, UserRepo],
})
export class UserModule {}
