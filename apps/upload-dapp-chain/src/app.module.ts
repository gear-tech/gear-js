import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";

import { HttpModule } from "@nestjs/axios";
import baseConfig from "./configs/base.config";

import { DappDataModule } from "./dapp-data/dapp-data.module";
import { DappData } from "./dapp-data/entities/dapp-data.entity";
import { User } from "./user/entities/user.entity";
import { BotModule } from "./bot/bot.module";

import { UserModule } from "./user/user.module";
import { CommandModule } from "./command/command.module";
import { TasksModule } from "./tasks/tasks.module";

const entities = [DappData, User];

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        headers: {
          "Content-Type": "application/json",
          Accept: configService.get<string>("github.GITHUB_API_ACCEPT"),
          Authorization: `token ${configService.get<string>(
            "github.GITHUB_ACCESS_TOKEN",
          )}`,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    BotModule,
    UserModule,
    CommandModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
