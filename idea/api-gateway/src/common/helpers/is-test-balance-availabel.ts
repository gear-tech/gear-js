import { testBalanceServicesMap } from '../../rabbitmq/init-rabbitmq';

export function isTestBalanceAvailable(genesis: string): boolean {
  return testBalanceServicesMap.has(genesis);
}
