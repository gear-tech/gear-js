import { GearApi } from "@gear-js/api";

let gearApi: GearApi;

export const gearService = {
  async connect() {
    gearApi = await GearApi.create({
      providerAddress: process.env.WS_PROVIDER,
    });
  },
  getApi() {
    return gearApi;
  },
};
