import { dataStorageServicesMap } from '../rabbitmq/init-rabbitmq';

export function isNetworkDataAvailable(genesis: string): boolean {
  return dataStorageServicesMap.has(genesis);
}
