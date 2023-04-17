import { GearApi, GearKeyring, decodeAddress } from '@gear-js/api';

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const mailbox = await api.mailbox.read(decodeAddress(alice.address));

  const messageWithValue = mailbox.find((item) => item[0].value.gtn(0));

  console.log(messageWithValue);

  const messageId = messageWithValue[0].id.toHex();

  api.mailbox.claimValue.submit(messageId);
  try {
    await new Promise((resolve, reject) => {
      api.mailbox.claimValue.signAndSend(alice, ({ events, status }) => {
        console.log(`STATUS: ${status.toString()}`);
        if (status.isFinalized) resolve(status.asFinalized);
        events.forEach(({ event }) => {
          if (event.method === 'UserMessageRead') {
            return console.log(event.toHuman());
          }

          if (event.method === 'ExtrinsicFailed') {
            return reject(api.getExtrinsicFailedError(event).docs.join('/n'));
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
