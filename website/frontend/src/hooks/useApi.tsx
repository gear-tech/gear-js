import { GearApi } from '@gear-js/api';
import { nodeApi } from '../api/initApi';

// TODO: find out how to use nodeApi.api! without !
export const useApi = (): [GearApi, boolean] => [nodeApi.api!, !!nodeApi.api];
