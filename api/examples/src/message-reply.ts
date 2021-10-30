import { CreateType, GearApi, GearKeyring } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { uploadDemoReply, messageToBob } from './read-mailbox';

export const messageReply = async () => {
  let endPromiseResolve;
  const endPromise = new Promise((resolve) => {
    endPromiseResolve = resolve;
  });
  let messageId;

  const api = await GearApi.create();
  const alice = GearKeyring.fromSuri('//Alice', 'Alice');
  const bob = GearKeyring.fromSuri('//Bob', 'Bob');

  const bobReply = (messageId: string) => {
    api.reply.submitReply({ toId: messageId, payload: 'Hello Alice', gasLimit: 200_000_000 }, meta);
    api.reply.signAndSend(bob, (data) => {});
  };
  const { programId, meta } = await uploadDemoReply(api, alice, u8aToHex(bob.addressRaw));

  api.gearEvents.subscribeLogEvents(({ data }) => {
    console.log(data.toHuman());
    if (data.source.toHex() === programId && data.dest.toHex() === u8aToHex(bob.addressRaw)) {
      console.log(CreateType.decode(meta.async_handle_output, data.payload, meta).toHuman());
      bobReply(data.id.toHex());
    }
    if (data.reply.isSome && data.reply.unwrap()[0].toHex() === messageId) {
      endPromiseResolve();
    }
  });

  messageId = await messageToBob(api, alice, programId, meta);

  return endPromise;
};

// main()
//   .catch((error) => {
//     console.log(error);
//   })
//   .finally(() => process.exit());
