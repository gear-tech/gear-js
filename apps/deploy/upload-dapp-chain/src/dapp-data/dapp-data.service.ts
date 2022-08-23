import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { decodeAddress, getWasmMetadata, Hex, IMessageSendOptions } from "@gear-js/api";
import { plainToClass } from "class-transformer";
import fetch from "node-fetch";

import {
  checkInitProgram,
  getAccount,
  getLatestReleaseByRepo,
  getNameDapp,
  getPayloads,
  getReleases,
  getUploadDappDataByDappName,
} from "../common/hellpers";
import { Asset, Release } from "../common/types";
import {
  CreateDappInput,
  UploadDappAssetData,
  UploadDappInChainInput,
  UploadDappInChainTGInput,
  UploadNewDappInChainInput,
} from "./types";
import { DappData } from "./entities/dapp-data.entity";
import { DappDataRepo } from "./dapp-data.repo";
import { gearService } from "../gear/gear-service";
import { BadRequestExc } from "../common/exceptions/bad-request.exception";
import { sendTransaction } from "../common/hellpers/send-transaction";

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

    try {
      const response = await getLatestReleaseByRepo(
        repo,
        this.configService.get<string>("github.GITHUB_OWNER_REPO"),
      );

      const dapp = await this.dappDataRepository.getByNameAndRepo(
        dappName,
        repo,
      );

      const {
        metaWasmDownloadUrl,
        optWasmDownloadUrl,
        release,
      } = this.getUploadDappByRepoAndName(dappName, repo, [response.data]);

      const [optWasmData, metaWasmData] = await Promise.all([
        fetch(optWasmDownloadUrl),
        fetch(metaWasmDownloadUrl),
      ]);

      const optWasmBuff = await optWasmData.buffer();
      const metaWasmBuff = await metaWasmData.buffer();
      const { payload } = getUploadDappDataByDappName(dappName);

      if (dapp) {
        return this.uploadDappInChainAndUpdate({
          gearApi,
          dappData: dapp,
          optWasmBuff,
          metaWasmBuff,
          release,
          payload,
        });
      }
      return this.uploadNewDappInChain({
        gearApi,
        metaWasmBuff,
        optWasmBuff,
        dappName,
        release,
        repo,
        payload,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  // eslint-disable-next-line consistent-return
  public async uploadDappsInChain(): Promise<DappData[]> {
    const result: DappData[] = [];
    const releases = await getReleases();
    const dappUploadDataList = getPayloads();

    const gearApi = gearService.getApi();

    for (const dappUploadData of dappUploadDataList) {
      const { dappName, repo } = dappUploadData;

      const {
        metaWasmDownloadUrl,
        optWasmDownloadUrl,
        release,
      } = this.getUploadDappByRepoAndName(dappName, repo, releases);

      const dapp = await this.dappDataRepository.getByNameAndRepo(
        dappName,
        repo,
      );

      const [optWasmData, metaWasmData] = await Promise.all([
        fetch(optWasmDownloadUrl),
        fetch(metaWasmDownloadUrl),
      ]);

      const optWasmBuff = await optWasmData.buffer();
      const metaWasmBuff = await metaWasmData.buffer();
      const { payload } = getUploadDappDataByDappName(dappName);

      if (dapp) {
        result.push(await this.uploadDappInChainAndUpdate({
          gearApi,
          dappData: dapp,
          optWasmBuff,
          metaWasmBuff,
          release,
          payload,
        }));
      } else {
        result.push(await this.uploadNewDappInChain({
          gearApi,
          metaWasmBuff,
          optWasmBuff,
          dappName,
          release,
          repo,
          payload,
        }));
      }
    }

    try {
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  private async uploadDappInChainAndUpdate(uploadDappInChainInput: UploadDappInChainInput): Promise<DappData> {
    const { dappData, optWasmBuff, metaWasmBuff, gearApi, release } = uploadDappInChainInput;

    const meta = await getWasmMetadata(metaWasmBuff);
    const [AL] = await getAccount();
    const sourceId = decodeAddress(AL.address);

    const gas = await gearApi.program.calculateGas.initUpload(
      sourceId,
      optWasmBuff,
      uploadDappInChainInput.payload,
      0,
      true,
      meta,
    );

    const program = {
      code: optWasmBuff,
      gasLimit: gas.min_limit,
      value: 0,
      initPayload: uploadDappInChainInput.payload,
    };

    const { programId } = gearApi.program.upload(program, meta);
    const status = checkInitProgram(gearApi, programId);
    await sendTransaction(gearApi, AL, "MessageEnqueued");

    console.log("_________>status", await status);

    dappData.id = programId;
    dappData.release = release;
    dappData.metaWasmBase64 = metaWasmBuff.toString("base64");
    dappData.updatedAt = new Date();

    const updateDapp = await this.dappDataRepository.save(dappData);

    return { ...updateDapp, metaWasmBase64: "long" };
  }

  private async uploadNewDappInChain(uploadNewDappInChainInput: UploadNewDappInChainInput): Promise<DappData> {
    const { metaWasmBuff,
      optWasmBuff,
      gearApi,
      dappName,
      release,
      repo,
      payload } = uploadNewDappInChainInput;

    const [AL] = await getAccount();
    const sourceId = decodeAddress(AL.address);

    if (!payload) {
      throw new BadRequestExc("Invalid dapp name");
    }

    const meta = await getWasmMetadata(metaWasmBuff);

    const gas = await gearApi.program.calculateGas.initUpload(
      sourceId,
      optWasmBuff,
      payload,
      0,
      true,
      meta,
    );

    const { programId } = gearApi.program.upload({
      code: optWasmBuff,
      gasLimit: gas.min_limit,
      value: 0,
      initPayload: payload,
    }, meta);
    const status = checkInitProgram(gearApi, programId);
    await sendTransaction(gearApi, AL, "MessageEnqueued");

    console.log("_________>status", await status);

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
      updatedAt: new Date(),
    });
    return this.dappDataRepository.save(dappDbType);
  }

  // eslint-disable-next-line consistent-return
  private getUploadDappByRepoAndName(name: string, repo: string, releases: Release[]): UploadDappAssetData {
    const dappName = name === "#nft" ? "nft" : name;

    for (const release of releases) {
      const [optUrl, metaUrl] = this.getDownloadUrlOptAndMetaWasmByNameDapp(dappName, release.assets);

      if (optUrl && metaUrl) {
        return { metaWasmDownloadUrl: metaUrl, optWasmDownloadUrl: optUrl, release: release.tag_name };
      }
    }
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
}
