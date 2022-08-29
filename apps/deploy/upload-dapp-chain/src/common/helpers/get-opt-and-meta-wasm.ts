import fetch, { Response } from "node-fetch";

export function getOptAndMetaWasm(optWasmDownloadUrl: string, metaWasmDownloadUrl:string): Promise<Response[]> {
  return Promise.all([
    fetch(optWasmDownloadUrl),
    fetch(metaWasmDownloadUrl),
  ]);
}
