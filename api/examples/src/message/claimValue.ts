import { GearApi, GearKeyring, UserMessageRead } from '@gear-js/api';

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const mailbox = await api.mailbox.read(GearKeyring.decodeAddress(alice.address));

  const messageWithValue = mailbox.find(([_, message]) => parseInt(message.value) > 0);

  console.log(messageWithValue);

  api.mailbox.claimValue.submit(messageWithValue[0][1]);
  try {
    await new Promise((resolve, reject) => {
      api.mailbox.claimValue.signAndSend(alice, ({ events, status }) => {
        console.log(status.toHuman());
        if (status.isFinalized) resolve(status.asFinalized);
        events.forEach(({ event }) => {
          if (event.method === 'UserMessageRead') {
            const {
              data: { reason },
            } = event as UserMessageRead;
            console.log(reason.toHuman());
          } else if (event.method === 'ExtrinsicFailed') {
            reject(api.getExtrinsicFailedError(event).docs.join('/n'));
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
