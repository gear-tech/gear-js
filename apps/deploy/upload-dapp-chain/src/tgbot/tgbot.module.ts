import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";

import { TgbotService } from "./tgbot.service";
import { DappDataModule } from "../dapp-data/dapp-data.module";
import { TgAccessAccountsGuard } from "../common/guards/tg-access-accounts.guard";

@Module({
  imports: [
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
  providers: [TgbotService, TgAccessAccountsGuard],
})
export class TgbotModule {}
