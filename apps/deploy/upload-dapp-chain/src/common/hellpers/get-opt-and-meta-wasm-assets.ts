import { Asset } from "../types";

export function getOptAndMetaWasmAssets(assets: Asset[]): Asset[] {
  return assets.filter((asset) => {
    const wordsFileName = asset.name.split(".");
    if (wordsFileName.includes("opt") || wordsFileName.includes("meta")) {
      return asset;
    }
  });
}
