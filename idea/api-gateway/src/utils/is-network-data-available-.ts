import { dataStoragePartitionsMap } from '../common/data-storage-partitions-map';

export function isNetworkDataAvailable(genesis: string): boolean {
  return dataStoragePartitionsMap.has(genesis);
}
