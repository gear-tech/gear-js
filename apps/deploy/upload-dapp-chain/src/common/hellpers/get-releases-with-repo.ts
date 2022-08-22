import { Release } from "../types";
import { getListRepo } from "./get-list-repo";
import { getLatestReleaseByRepo } from "./get-latest-release-by-repo";
import { getOptAndMetaWasmAssets } from "./get-opt-and-meta-wasm-assets";

// eslint-disable-next-line consistent-return
export async function getReleasesWithRepo(): Promise<
  Awaited<{ repo: string; release: Release }>[]
  > {
  const result: { repo: string; release: Release }[] = [];
  const listRepo = getListRepo();
  const owner = process.env.GITHUB_OWNER_REPO;

  try {
    for (const repo of listRepo) {
      const release = await getLatestReleaseByRepo(repo, owner);
      result.push({
        repo,
        release: {
          ...release.data,
          assets: getOptAndMetaWasmAssets(release.data.assets),
        },
      });
    }
    return result;
  } catch (error) {
    console.log(error);
  }
}
