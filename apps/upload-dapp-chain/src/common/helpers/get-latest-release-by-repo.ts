import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";

import "dotenv/config";
import { Repo } from "../types/repo";

// eslint-disable-next-line consistent-return
export async function getLatestReleaseByRepo(repo: string): Promise<AxiosResponse<Repo>> {
  const httpService = new HttpService();

  try {
    return httpService
      .get<Repo>(
        `${process.env.GITHUB_API_BASE_URL}/repos/${process.env.GITHUB_OWNER_REPO}/${repo}/releases/latest`,
      ).toPromise();
  } catch (error) {
    console.log("Get latest releases by repository error");
    console.log(error);
  }
}
