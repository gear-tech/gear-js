import { GearKeyring } from '@gear-js/api';

export default async () => {
  return {
    alice: await GearKeyring.fromSuri('//Alice'),
    bob: await GearKeyring.fromSuri('//Bob'),
  };
};
