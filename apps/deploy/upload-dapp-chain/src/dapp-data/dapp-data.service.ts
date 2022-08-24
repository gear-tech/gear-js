import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { decodeAddress, GearApi, getWasmMetadata, Hex, IMessageSendOptions } from "@gear-js/api";
import { plainToClass } from "class-transformer";
import { KeyringPair } from "@polkadot/keyring/types";
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
import { ApiKey } from "../common/enums";

@Injectable()
export class DappDataService {
  private logger: Logger = new Logger("CodeService");
  private gearApi: GearApi = gearService.getApi();

  constructor(
    private configService: ConfigService,
    private dappDataRepository: DappDataRepo,
  ) {}

  public async uploadDappInChain(uploadDappInChainTGInput: UploadDappInChainTGInput): Promise<DappData> {
    const { dappName, repo } = uploadDappInChainTGInput;
    const [AL] = await getAccount();

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
        const updateDapp = await this.uploadDappInChainAndUpdate({
          dappData: dapp,
          optWasmBuff,
          metaWasmBuff,
          release,
          payload,
          account: AL,
        });
        return { ...updateDapp, metaWasmBase64: "long" };
      }
      const newDapp = await this.uploadNewDappInChain({
        account: AL,
        metaWasmBuff,
        optWasmBuff,
        dappName,
        release,
        repo,
        payload,
      });
      return { ...newDapp, metaWasmBase64: "long" };
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
  }

  // eslint-disable-next-line consistent-return
  public async uploadDappsInChain(): Promise<DappData[]> {
    const result: DappData[] = [];
    const releases = await getReleases();
    const dappUploadDataList = getPayloads();
    const [AL] = await getAccount();

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
          account: AL,
          dappData: dapp,
          optWasmBuff,
          metaWasmBuff,
          release,
          payload,
        }));
      } else {
        result.push(await this.uploadNewDappInChain({
          account: AL,
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
      await this.sendMessageUploadedMarketplace(AL, result);
      return result;
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
  }

  private async uploadDappInChainAndUpdate(uploadDappInChainInput: UploadDappInChainInput): Promise<DappData> {
    const { dappData, optWasmBuff, metaWasmBuff, release, account } = uploadDappInChainInput;

    const meta = await getWasmMetadata(metaWasmBuff);
    const sourceId = decodeAddress(account.address);

    const gas = await this.gearApi.program.calculateGas.initUpload(
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

    const { programId } = this.gearApi.program.upload(program, meta);
    const status = checkInitProgram(this.gearApi, programId);
    await sendTransaction(this.gearApi, account, "MessageEnqueued", ApiKey.PROGRAM);

    console.log("_________>status", await status);

    dappData.id = programId;
    dappData.release = release;
    dappData.metaWasmBase64 = metaWasmBuff.toString("base64");
    dappData.updatedAt = new Date();

    return this.dappDataRepository.save(dappData);
  }

  private async uploadNewDappInChain(uploadNewDappInChainInput: UploadNewDappInChainInput): Promise<DappData> {
    const {
      metaWasmBuff,
      optWasmBuff,
      dappName,
      release,
      repo,
      payload,
      account,
    } = uploadNewDappInChainInput;

    const sourceId = decodeAddress(account.address);

    if (!payload) {
      throw new BadRequestExc("Invalid dapp name");
    }

    const meta = await getWasmMetadata(metaWasmBuff);

    const gas = await this.gearApi.program.calculateGas.initUpload(
      sourceId,
      optWasmBuff,
      payload,
      0,
      true,
      meta,
    );

    const { programId } = this.gearApi.program.upload({
      code: optWasmBuff,
      gasLimit: gas.min_limit,
      value: 0,
      initPayload: payload,
    }, meta);
    const status = checkInitProgram(this.gearApi, programId);
    await sendTransaction(this.gearApi, account, "MessageEnqueued", ApiKey.PROGRAM);

    console.log("_________>status", await status);

    const createDappInput: CreateDappInput = {
      id: programId,
      name: dappName,
      release,
      repo,
      metaWasmBase64: metaWasmBuff.toString("base64"),
    };

    return this.createDapp(createDappInput);
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

  private async sendMessageUploadedMarketplace(account: KeyringPair, uploadedPrograms: DappData[]): Promise<void> {
    const sourceId = decodeAddress(account.address);

    const nftForMarketplace = uploadedPrograms.find(uploadedProgram => uploadedProgram.name === "#nft");
    const uploadMarketplace = uploadedPrograms.find(uploadedProgram => uploadedProgram.name === "nft_marketplace");

    if (!nftForMarketplace || !uploadMarketplace) {
      return;
    }

    try {
      const buff = Buffer.from(uploadMarketplace.metaWasmBase64, "base64");
      const meta = await getWasmMetadata(buff);

      const gas = await this.gearApi.program.calculateGas.handle(
        sourceId,
        buff,
        { AddNftContract: nftForMarketplace.id },
        0,
        true,
        meta,
      );

      const message: IMessageSendOptions = {
        destination: uploadMarketplace.id as Hex,
        payload: { AddNftContract: nftForMarketplace.id },
        gasLimit: gas.min_limit,
        value: 0,
      };

      this.gearApi.message.send(message, meta);

      await sendTransaction(this.gearApi, account, "MessageEnqueued", ApiKey.MESSAGE);
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }
}
