import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DappDataController } from "./dapp-data.controller";
import { DappDataService } from "./dapp-data.service";
import { DappDataRepo } from "./dapp-data.repo";
import { DappData } from "./entities/dapp-data.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([DappData]),
  ],
  controllers: [DappDataController],
  providers: [DappDataService, DappDataRepo],
  exports: [DappDataService],
})
export class DappDataModule {}
