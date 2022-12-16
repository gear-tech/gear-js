import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";

import { BotService } from "./bot.service";
import { DappDataModule } from "../dapp-data/dapp-data.module";
import { UserModule } from "../user/user.module";
import { BotController } from "./bot.controller";
import { CodeModule } from "../code/code.module";
import { ProgramModule } from "../program/program.module";
import { MessageModule } from "../message/message.module";

@Module({
  imports: [
    DappDataModule,
    UserModule,
    CodeModule,
    ProgramModule,
    MessageModule,
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
