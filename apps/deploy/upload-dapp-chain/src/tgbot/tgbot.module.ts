import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TgbotService } from "./tgbot.service";
import { DappDataModule } from "../dapp-data/dapp-data.module";
import { TgbotUserRepo } from "./tgbot-user.repo";
import { TgbotUser } from "./entities/tgbot-user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([TgbotUser]),
    DappDataModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>("bot.TELEGRAM_BOT_TOKEN"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [TgbotService, TgbotUserRepo],
  exports: [TgbotUserRepo],
})
export class TgbotModule {}
