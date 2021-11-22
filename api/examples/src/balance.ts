import { GearApi, GearKeyring } from '@gear-js/api';

export const balance = async () => {
  const api = await GearApi.create();
  const alice = GearKeyring.fromSuri('//Alice');
  const freeBalance = await api.balance.findOut(alice.address);
  console.log(freeBalance.toHuman());
};

balance().finally(() => process.exit(0));
