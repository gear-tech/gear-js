import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import baseConfig from "./configs/base.config";

import { DappDataModule } from "./dapp-data/dapp-data.module";
import { DappData } from "./dapp-data/entities/dapp-data.entity";
import { User } from "./user/entities/user.entity";
import { TgbotModule } from "./tgbot/tgbot.module";
import { UserModule } from "./user/user.module";
import { WorkflowCommandModule } from "./workflow-command/workflow-command.module";

const entities = [DappData, User];

@Module({
  imports: [
    DappDataModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("db.DB_HOST"),
        port: configService.get<number>("db.DB_PORT"),
        username: configService.get<string>("db.DB_USER"),
        password: configService.get<string>("db.DB_PASSWORD"),
        database: configService.get<string>("db.DB_DATABASE"),
        logging: true,
        entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    TgbotModule,
    UserModule,
    WorkflowCommandModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
