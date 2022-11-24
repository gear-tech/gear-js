import { runSchedulerGenesisHashes } from './genesis-hashes.scheduler';
import { runSchedulerNetworkDataStorages } from './network-data-storages.scheduler';

export async function runSchedulers() {
  await Promise.all([
    runSchedulerGenesisHashes(),
    runSchedulerNetworkDataStorages()
  ]);
}
