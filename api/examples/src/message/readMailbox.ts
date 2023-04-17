import { GearApi, GearKeyring, decodeAddress } from '@gear-js/api';

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const mailbox = await api.mailbox.read(decodeAddress(alice.address));

  console.log(mailbox);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
