import { GearApi, GearKeyring } from '@gear-js/api';

export const balance = async () => {
  const api = await GearApi.create();
  const alice = await GearKeyring.fromSuri('//Alice');
  api.gearEvents.subsribeBalanceChange(alice.address, (newBalance) => {
    console.log(newBalance.toHuman());
    console.log(newBalance);
  });
};

balance();
