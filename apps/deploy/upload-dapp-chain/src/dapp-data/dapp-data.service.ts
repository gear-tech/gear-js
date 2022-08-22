import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { decodeAddress, getWasmMetadata } from "@gear-js/api";
import { plainToClass } from "class-transformer";
import fetch from "node-fetch";

import {
  getAccount,
  getAllLatestReleaseDapps,
  getLatestReleaseByRepo,
  getNameDapp,
} from "../common/hellpers";
import { Asset, Release } from "../common/types";
import {
  CreateDappInput,
  UploadDappInChainInput, UploadDappInChainTGInput,
  UploadNewDappInChainInput,
} from "./types";
import { DappData } from "./entities/dapp-data.entity";

import { DappDataRepo } from "./dapp-data.repo";
import { gearService } from "../gear/gear-service";
import { DAPP } from "../common/enums";
import { BadRequestExc } from "../common/exceptions/bad-request.exception";

@Injectable()
export class DappDataService {
  private logger: Logger = new Logger("CodeService");

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private dappDataRepository: DappDataRepo,
  ) {}

  public async uploadDappInChain(uploadDappInChainTGInput: UploadDappInChainTGInput): Promise<DappData> {
    const { dappName, repo } = uploadDappInChainTGInput;
    const gearApi = gearService.getApi();
    const [AL] = await getAccount();
    const sourceId = decodeAddress(AL.address);

    try {
      const response = await getLatestReleaseByRepo(
        repo,
        this.configService.get<string>("github.GITHUB_OWNER_REPO"),
      );

      const dapp = await this.dappDataRepository.getByNameAndRepo(
        dappName,
        repo,
      );

      const [optUrl, metaUrl] = this.getDownloadUrlOptAndMetaWasmByNameDapp(
        dappName,
        response.data.assets,
      );

      const [optWasmData, metaWasmData] = await Promise.all([
        fetch(optUrl),
        fetch(metaUrl),
      ]);

      const optWasmBuff = await optWasmData.buffer();
      const metaWasmBuff = await metaWasmData.buffer();

      if (dapp) {
        return this.uploadDappInChainAndUpdate({
          gearApi,
          dappData: dapp,
          optWasmBuff,
          metaWasmBuff,
          sourceId,
          release: response.data.tag_name,
        });
      }
      return this.uploadNewDappInChain({
        gearApi,
        sourceId,
        metaWasmBuff,
        optWasmBuff,
        dappName,
        release: response.data.tag_name,
        repo,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getLatestReleasesDapps() {
    try {
      const res = await getAllLatestReleaseDapps();
      console.log(res);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async uploadDappInChainAndUpdate(uploadDappInChainInput: UploadDappInChainInput): Promise<DappData> {
    const { dappData, optWasmBuff, metaWasmBuff, sourceId, gearApi, release } = uploadDappInChainInput;

    const meta = await getWasmMetadata(metaWasmBuff);

    const gas = await gearApi.program.calculateGas.initUpload(
      sourceId,
      optWasmBuff,
      meta.types,
      0,
      true,
    );
    const program = {
      code: optWasmBuff,
      gasLimit: gas.min_limit,
      value: 0,
    };
    const { programId } = gearApi.program.upload(program, meta);

    dappData.id = programId;
    dappData.release = release;
    dappData.metaWasmBase64 = metaWasmBuff.toString("base64");

    const updateDapp = await this.dappDataRepository.save(dappData);

    return { ...updateDapp, metaWasmBase64: "long" };
  }

  private async uploadNewDappInChain(uploadNewDappInChainInput: UploadNewDappInChainInput): Promise<DappData> {
    const { sourceId, metaWasmBuff, optWasmBuff, gearApi, dappName, release, repo } = uploadNewDappInChainInput;
    const paylaod = this.getPayloadByDappName(dappName);

    if (!paylaod) {
      throw new BadRequestExc("Invalid dapp name");
    }

    const meta = await getWasmMetadata(metaWasmBuff);

    const gas = await gearApi.program.calculateGas.initUpload(
      sourceId,
      optWasmBuff,
      meta.types,
      0,
      true,
    );

    const { programId } = gearApi.program.upload({
      code: optWasmBuff,
      gasLimit: gas.min_limit,
      value: 0,
      initPayload: this.getPayloadByDappName(dappName),
    }, meta);

    const createDappInput: CreateDappInput = {
      id: programId,
      name: dappName,
      release,
      repo,
      metaWasmBase64: metaWasmBuff.toString("base64"),
    };

    const dapp = await this.createDapp(createDappInput);

    return { ...dapp, metaWasmBase64: "long" };
  }

  private createDapp(createDappInput: CreateDappInput): Promise<DappData> {
    const dappDbType = plainToClass(DappData, {
      ...createDappInput,
    });
    return this.dappDataRepository.save(dappDbType);
  }

  private getDownloadUrlOptAndMetaWasmByNameDapp(
    name: string,
    assets: Asset[],
  ): string[] {
    const result = [];

    for (const asset of assets) {
      if (name === getNameDapp(asset.name) && asset.name.split(".").includes("opt")) {
        result[0] = asset.browser_download_url;
      }
      if (name === getNameDapp(asset.name) && asset.name.split(".").includes("meta")) {
        result[1] = asset.browser_download_url;
      }
    }
    return result;
  }

  private getPayloadByDappName(name: string) {
    const payloads = {
      [DAPP.NFT]: { name: "test", symbol: "test", baseUri: "test", royalties: null },
      [DAPP.NFT_MARKETPLACE]: { adminId: this.configService.get<string>("nftMarketplace.NFT_MARKETPLACE_ADMIN_ID"),
        treasuryId: this.configService.get<string>("nftMarketplace.NFT_MARKETPLACE_TREASURY_ID"),
        treasuryFee: "1" },
      [DAPP.LOTTERY]: "0x00",
      [DAPP.DUTCH_AUCTION]: "0x00",
      [DAPP.ESCROW]: "--",
      [DAPP.SUPPLY_CHAIN]: "--",
      default: false,
    };

    return payloads[name] || payloads.default;
  }

  private getNameDappsByRelease(release: Release): string[] {
    return release.assets.reduce((nameDapps, asset) => {
      const dappName = getNameDapp(asset.name);

      if (!nameDapps.includes(dappName)) {
        // eslint-disable-next-line no-param-reassign
        nameDapps = [...nameDapps, dappName];
      }
      return nameDapps;
    }, [] as string[]);
  }
}
