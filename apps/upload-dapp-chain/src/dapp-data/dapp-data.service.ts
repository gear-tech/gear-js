import { Injectable } from "@nestjs/common";

import { DappData } from "./entities/dapp-data.entity";
import { DappDataRepo } from "./dapp-data.repo";
import { UploadProgramResult } from "../command/types";

@Injectable()
export class DappDataService {
  constructor(private dappDataRepository: DappDataRepo) {}

  public async getDappDataByNames(names: string | string[]): Promise<DappData | DappData[]> {
    if(Array.isArray(names)) {
      return this.dappDataRepository.getByNames(names)
    }
    return this.dappDataRepository.getByName(names)
  }

  public async createDappsData(uploadProgramsResult: UploadProgramResult[]): Promise<DappData[]> {
    const dappsData = uploadProgramsResult.map((uploadProgram) => {
      const { dapp, metaWasmBase64, programId, repo } = uploadProgram;
      return { id: programId, name: dapp, metaWasmBase64, repo, updatedAt: new Date() } as DappData;
    });

    return this.dappDataRepository.save(dappsData);
  }
}
