import { GearApi, Hex } from "@gear-js/api";

import { DappData } from "../entities/dapp-data.entity";
import { DAPP, REPO } from "../../common/enums";

export class UploadDappInChainTGInput {
  public dappName!: DAPP;
  public repo!: REPO;
}

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
  sourceId: Hex;
  release: string;
  payload: {[key: string]: string} | string;
}

interface UploadDappAssetData {
  optWasmDownloadUrl: string;
  metaWasmDownloadUrl: string;
  release: string;
}

type UploadNewDappInChainInput = Pick<UploadDappInChainInput,
    "gearApi" | "optWasmBuff" | "metaWasmBuff" | "sourceId">
  & { dappName: string, release: string, repo: string, payload: {[key: string]: string} | string};

export { CreateDappInput, UploadDappInChainInput, UploadNewDappInChainInput, UploadDappAssetData };
