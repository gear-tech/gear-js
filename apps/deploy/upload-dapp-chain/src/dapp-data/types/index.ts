import { GearApi, Hex } from "@gear-js/api";

import { DappData } from "../entities/dapp-data.entity";
import { DAPP, REPO } from "../../common/enums";

export class UploadDappInChainTGInput {
  public dappName!: DAPP;
  public repo!: REPO;
}

type Payload = {[key: string]: string} | string;

interface CreateDappInput {
  id: string;
  name: string;
  release: string;
  metaWasmBase64: string;
  repo: string
}

interface UploadDappInChainInput {
  gearApi: GearApi;
  dappData: DappData;
  optWasmBuff: Buffer;
  metaWasmBuff: Buffer;
  release: string;
  payload: Payload
}

interface SendMessageUploadedMarketplaceInput {
  uploadedNftProgramId: string
}

interface UploadDappAssetData {
  optWasmDownloadUrl: string;
  metaWasmDownloadUrl: string;
  release: string;
}

type UploadNewDappInChainInput = Pick<UploadDappInChainInput,
    "gearApi" | "optWasmBuff" | "metaWasmBuff" >
  & { dappName: string, release: string, repo: string, payload: {[key: string]: string} | string};

export { CreateDappInput,
  UploadDappInChainInput,
  UploadNewDappInChainInput,
  UploadDappAssetData,
  SendMessageUploadedMarketplaceInput };
