import { load } from "js-yaml";
import { readFileSync } from "fs";
import * as fs from "fs";
import * as yaml from "js-yaml";

import "dotenv/config";

import { getLatestReleaseByRepo } from "./get-latest-release-by-repo";
import { WorkflowYamlData, Asset } from "../types";

function getShortDappName(fullName: string): string {
  const chars = fullName.split("");
  let indexLastIndex;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < chars.length; i++) {
    if (Number(chars[i]) || Number(chars[i]) === 0) {
      indexLastIndex = i - 1;
      break;
    }
  }

  return fullName.slice(0, indexLastIndex);
}

function getOptAndMetaDownloadUrl(dapp: string, repoAssets: Asset[]): string[] {
  const res = [];

  const dappName = dapp === "#nft" ? "nft" : dapp;

  for (const asset of repoAssets) {
    if (getShortDappName(asset.name) === dappName && asset.name.includes("opt")) {
      res[0] = asset.browser_download_url;
    }
    if (getShortDappName(asset.name) === dappName && asset.name.includes("meta")) {
      res[1] = asset.browser_download_url;
    }
  }

  // [optDownloadUrl, metaDownloadUrl]
  return res;
}

export async function updateProgramDataByReleaseRepo(): Promise<void> {
  const pathWorkflowYaml = process.env.WORKFLOW_PATH as string;
  // eslint-disable-next-line no-path-concat
  const workflowYamlData = load(readFileSync(__dirname + pathWorkflowYaml, "utf8")) as WorkflowYamlData;
  const programKeys = Object.keys(workflowYamlData.programs);

  for (const programKey of programKeys) {
    try {
      const programData = workflowYamlData.programs[programKey];
      const res = await getLatestReleaseByRepo(programData.repo);

      const [optDownloadUrl, metaDownloadUrl] = getOptAndMetaDownloadUrl(programData.dapp, res.data.assets);

      programData.metaDownloadUrl = metaDownloadUrl;
      programData.optDownloadUrl = optDownloadUrl;
    } catch (error) {
      console.log("_________UPDATE_WORKFLOW_YAML_DAPP_DATA_ERROR_________", error);
    }
  }

  // eslint-disable-next-line no-path-concat
  fs.writeFile(__dirname + pathWorkflowYaml, yaml.dump(workflowYamlData), (error) => {
    if (error) console.log("_________UPDATE_WORKFLOW_YAML_FILE_ERROR_________", error);
  });
}
