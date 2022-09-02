import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { DappData } from "./entities/dapp-data.entity";

@Injectable()
export class DappDataRepo {
  constructor(
    @InjectRepository(DappData)
    private dappDataRepository: Repository<DappData>,
  ) {}

  public async save(dappsData: DappData[]): Promise<DappData[]> {
    return this.dappDataRepository.save(dappsData);
  }

  public async get(id: string): Promise<DappData> {
    return this.dappDataRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async getByName(name: string): Promise<DappData> {
    return this.dappDataRepository.findOne({
      where: {
        name,
      },
    });
  }

  public async getByNames(names: string[]): Promise<DappData[]> {
    return this.dappDataRepository.find({
      where: names.map(name => ({name}))
    })
  }
}
