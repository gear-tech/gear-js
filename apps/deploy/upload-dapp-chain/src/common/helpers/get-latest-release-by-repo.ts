import { HttpService } from "@nestjs/axios";

import { AxiosResponse } from "axios";

import "dotenv/config";

// eslint-disable-next-line consistent-return
export async function getLatestReleaseByRepo(repo: string, owner: string): Promise<AxiosResponse<any>> {
  const httpService = new HttpService();

  try {
    return httpService
      .get(
        `${process.env.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/releases/latest`,
      )
      .toPromise();
  } catch (error) {
    console.log(error);
  }
}
