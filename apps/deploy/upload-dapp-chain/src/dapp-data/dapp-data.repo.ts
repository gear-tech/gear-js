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

  public async save(dappData: DappData): Promise<DappData> {
    return this.dappDataRepository.save(dappData);
  }

  public async get(id: string): Promise<DappData> {
    return this.dappDataRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async getByNameAndRepo(name: string, repo: string): Promise<DappData> {
    return this.dappDataRepository.findOne({
      where: {
        name,
        repo,
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
}
