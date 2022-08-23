import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TgbotUser } from "./entities/tgbot-user.entity";

@Injectable()
export class TgbotUserRepo {
  constructor(
    @InjectRepository(TgbotUser)
    private tgbotUserRepository: Repository<TgbotUser>,
  ) {}

  public async save(tgbotUser: TgbotUser): Promise<TgbotUser> {
    return this.tgbotUserRepository.save(tgbotUser);
  }

  public async get(id: string): Promise<TgbotUser> {
    return this.tgbotUserRepository.findOne({
      where: {
        id,
      },
    });
  }
}
