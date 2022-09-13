import { GearApi } from '@gear-js/api';

import configuration from '../config/configuration';
import { changeStatus } from '../healthcheck/healthcheck.controller';

let gearApi: GearApi;
const { gear } = configuration();

export const gearService = {
  async connect(): Promise<void> {
    try {
      gearApi = new GearApi({
        providerAddress: gear.wsProvider,
        throwOnConnect: true,
      });

      gearApi.isReadyOrError.catch(console.error);
      try {
        await gearApi.isReady;
      } catch (error) {
        console.log('api.isReady', error);
      }

      const chain = await gearApi.chain();
      const genesis = gearApi.genesisHash.toHex();
      const version = gearApi.runtimeVersion.specVersion.toHuman();

      console.log('______>chain | genesis | version', chain, genesis, version);
    } catch (error) {
      console.log('api.isReady', error);
    }
    changeStatus('gearWSProvider');
  },
  getApi(): GearApi {
    return gearApi;
  },
};
