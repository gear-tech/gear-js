import { servicesPartitionMap } from '../common/services-partition-map';

export function isNetworkDataAvailable(genesis: string): boolean {
  return servicesPartitionMap.has(genesis);
}
