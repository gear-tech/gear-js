import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { decodeAddress, getWasmMetadata } from "@gear-js/api";
import { plainToClass } from "class-transformer";
import fetch from "node-fetch";

import {
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

      const {
        metaWasmDownloadUrl,
        optWasmDownloadUrl,
        release,
      } = this.getUploadDappByRepoAndDappName(dappName, repo, [response.data]);

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
          sourceId,
          release,
        });
      }
      return this.uploadNewDappInChain({
        gearApi,
        sourceId,
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
    const promises = [];
    const releases = await getReleases();
    const dappUploadDataList = getPayloads();

    const gearApi = gearService.getApi();
    const [AL] = await getAccount();
    const sourceId = decodeAddress(AL.address);

    for (const dappUploadData of dappUploadDataList) {
      const { dappName, repo } = dappUploadData;

      const {
        metaWasmDownloadUrl,
        optWasmDownloadUrl,
        release,
      } = this.getUploadDappByRepoAndDappName(dappName, repo, releases);

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
        promises.push(this.uploadDappInChainAndUpdate({
          gearApi,
          dappData: dapp,
          optWasmBuff,
          metaWasmBuff,
          sourceId,
          release,
        }));
      } else {
        promises.push(this.uploadNewDappInChain({
          gearApi,
          sourceId,
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
      return Promise.all(promises);
    } catch (error) {
      console.log(error);
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
    const { sourceId,
      metaWasmBuff,
      optWasmBuff,
      gearApi,
      dappName,
      release,
      repo,
      payload } = uploadNewDappInChainInput;

    if (!payload) {
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
      initPayload: payload,
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

  // eslint-disable-next-line consistent-return
  private getUploadDappByRepoAndDappName(name: string, repo: string, releases: Release[]): UploadDappAssetData {
    for (const release of releases) {
      const [optUrl, metaUrl] = this.getDownloadUrlOptAndMetaWasmByNameDapp(name, release.assets);

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
