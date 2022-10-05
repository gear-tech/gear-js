import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";

import { BotService } from "./bot.service";
import { DappDataModule } from "../dapp-data/dapp-data.module";
import { UserModule } from "../user/user.module";
import { BotController } from "./bot.controller";
import { CommandModule } from "../command/command.module";

@Module({
  imports: [
    DappDataModule,
    UserModule,
    CommandModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>("bot.TELEGRAM_BOT_TOKEN"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [BotService, BotController],
  exports: [],
})
export class BotModule {}
