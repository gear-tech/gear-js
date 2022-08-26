import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";

import { TgbotService } from "./tgbot.service";
import { DappDataModule } from "../dapp-data/dapp-data.module";
import { UserModule } from "../user/user.module";
import { TgbotController } from "./tgbot.controller";
import { WorkflowCommandModule } from "../workflow-command/workflow-command.module";

@Module({
  imports: [
    DappDataModule,
    UserModule,
    WorkflowCommandModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>("bot.TELEGRAM_BOT_TOKEN"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [TgbotService, TgbotController],
  exports: [],
})
export class TgbotModule {}
