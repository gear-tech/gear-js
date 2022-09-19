import { GearApi } from '@gear-js/api';

import configuration from '../config/configuration';
import { changeStatus } from '../healthcheck/healthcheck.controller';

let gearApi: GearApi;
const { gear } = configuration();

export const gearService = {
  async connect(): Promise<void> {
    try {
      gearApi = await GearApi.create({
        providerAddress: gear.wsProvider,
        throwOnConnect: true,
      });

      const chain = await gearApi.chain();
      const genesis = gearApi.genesisHash.toHex();
      const version = gearApi.runtimeVersion.specVersion.toHuman();

      console.log('_________CONNECTION_NODE_DATA_________');
      console.log(`CHAIN --- ${chain}\n GENESIS --- ${genesis}\n VERSION --- ${version}`);

      changeStatus('gearWSProvider');
    } catch (error) {
      console.log('api.isReady', error);
    }
  },
  getApi(): GearApi {
    return gearApi;
  },
};
