import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DappDataController } from "./dapp-data.controller";
import { DappDataService } from "./dapp-data.service";
import { DappDataRepo } from "./dapp-data.repo";
import { DappData } from "./entities/dapp-data.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([DappData]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
          Authorization: `token ${configService.get<string>(
            "github.GITHUB_ACCESS_TOKEN",
          )}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DappDataController],
  providers: [DappDataService, DappDataRepo],
  exports: [DappDataService],
})
export class DappDataModule {}
