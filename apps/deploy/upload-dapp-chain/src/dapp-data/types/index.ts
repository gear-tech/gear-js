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
  release: string
}

type UploadNewDappInChainInput = Pick<UploadDappInChainInput,
    "gearApi" | "optWasmBuff" | "metaWasmBuff" | "sourceId"> & { dappName: string, release: string, repo: string};

export { CreateDappInput, UploadDappInChainInput, UploadNewDappInChainInput };
