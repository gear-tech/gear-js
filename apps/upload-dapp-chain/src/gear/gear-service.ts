import { GearApi } from "@gear-js/api";

let gearApi: GearApi;

export const gearService = {
  async connect(): Promise<void> {
    gearApi = await GearApi.create({
      providerAddress: process.env.GEAR_WS_PROVIDER,
      throwOnConnect: true,
    });
    console.log(`⚙️ Connected to ${gearApi.runtimeChain} with genesis ${gearApi.genesisHash.toHex()}`);
  },
  getApi(): GearApi {
    return gearApi;
  },
};
