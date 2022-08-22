import { readFileSync } from "fs";
import { load } from "js-yaml";

import { DappUploadData } from "../types/dapp-upload-data";

// eslint-disable-next-line consistent-return
export function getListRepo(): string[] {
  const pathDappsPayloads = process.env.DAPPS_PAYLOADS_PATH as string;
  try {
    // eslint-disable-next-line no-path-concat
    const payloads = load(readFileSync(__dirname + pathDappsPayloads, "utf8")) as DappUploadData[];

    return payloads.reduce((listPayloads, payload) => {
      if (!listPayloads.includes(payload.repo)) {
        // eslint-disable-next-line no-param-reassign
        listPayloads = [...listPayloads, payload.repo];
      }
      return listPayloads;
    }, [] as string[]);
  } catch (err) {
    console.error(err);
  }
}
