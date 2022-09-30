import fetch, { Response } from "node-fetch";

// eslint-disable-next-line consistent-return
export function getOptAndMetaWasm(optWasmDownloadUrl: string, metaWasmDownloadUrl:string): Promise<Response[]> {
  try {
    return Promise.all([
      fetch(optWasmDownloadUrl),
      fetch(metaWasmDownloadUrl),
    ]);
  } catch (error) {
    console.log("________>getOptAndMetaWasm");
    console.log(error);
  }
}
