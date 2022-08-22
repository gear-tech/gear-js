import { load } from "js-yaml";
import { readFileSync } from "fs";

import { DappUploadData } from "../types/dapp-upload-data";

require("dotenv").config();

// eslint-disable-next-line consistent-return
export function getUploadDappDataByDappName(name: string): DappUploadData {
  const pathDappsPayloads = process.env.DAPPS_PAYLOADS_PATH as string;
  try {
    // eslint-disable-next-line no-path-concat
    const payloads = load(readFileSync(__dirname + pathDappsPayloads, "utf8")) as DappUploadData[];

    return payloads.find(payload => payload.dappName === name);
  } catch (error) {
    console.log(error);
  }
}
