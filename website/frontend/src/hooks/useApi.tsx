import { GearApi } from '@gear-js/api';
import { nodeApi } from '../api/initApi';

export const useApi = (): [GearApi | null, boolean] => [nodeApi.api, !!nodeApi.api];
