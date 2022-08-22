import { Release } from "../types";
import { getListRepo } from "./get-list-repo";
import { getLatestReleaseByRepo } from "./get-latest-release-by-repo";

// eslint-disable-next-line consistent-return
export async function getReleases(): Promise<
  Awaited<Release>[]
  > {
  const result: Release[] = [];
  const listRepo = getListRepo();
  const owner = process.env.GITHUB_OWNER_REPO;

  try {
    for (const repo of listRepo) {
      const release = await getLatestReleaseByRepo(repo, owner);
      result.push(release.data);
    }
    return result;
  } catch (error) {
    console.log(error);
  }
}
