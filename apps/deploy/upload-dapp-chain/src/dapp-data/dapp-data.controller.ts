import { Controller, Get, Param } from "@nestjs/common";

import { DappDataService } from "./dapp-data.service";
import { DappData } from "./entities/dapp-data.entity";
import { DappDataRepo } from "./dapp-data.repo";

@Controller("dapp_data")
export class DappDataController {
  constructor(
    private dappDataService: DappDataService,
    private dappDataRepository: DappDataRepo,
  ) {}

  @Get("release")
  public getLatestRelease() {
    return this.dappDataService.getLatestReleasesDapps();
  }

  @Get(":id")
  public getDappDataById(@Param("id") id: string): Promise<DappData> {
    return this.dappDataRepository.get(id);
  }

  @Get(":name")
  public getDappDataByName(@Param("name") name: string): Promise<DappData> {
    return this.dappDataRepository.getByName(name);
  }
}
