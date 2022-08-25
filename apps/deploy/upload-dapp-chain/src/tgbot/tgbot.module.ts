import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";

import { TgbotService } from "./tgbot.service";
import { DappDataModule } from "../dapp-data/dapp-data.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    DappDataModule,
    UserModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>("bot.TELEGRAM_BOT_TOKEN"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [TgbotService],
  exports: [],
})
export class TgbotModule {}
