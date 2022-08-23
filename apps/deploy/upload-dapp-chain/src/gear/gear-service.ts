import { GearApi } from "@gear-js/api";

let gearApi: GearApi;

export const gearService = {
  async connect(): Promise<void> {
    gearApi = await GearApi.create({
      providerAddress: process.env.WS_PROVIDER,
    });
  },
  getApi(): GearApi {
    return gearApi;
  },
};
