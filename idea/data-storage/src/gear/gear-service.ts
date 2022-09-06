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
    } catch (error) {
      console.log('api.isReady', error);
    }
    changeStatus('gearWSProvider');
  },
  getApi(): GearApi {
    return gearApi;
  },
};
