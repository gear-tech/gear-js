import { GearApi, GearKeyring, getWasmMetadata } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import * as fs from 'fs';

async function main() {
  let endPromiseResolve;
  const endPromise = new Promise((resolve) => {
    endPromiseResolve = resolve;
  });
  let messageId;

  const api = await GearApi.create();
  const alice = GearKeyring.fromSuri('//Alice', 'Alice');
  const bob = GearKeyring.fromSuri('//Bob', 'Bob');

  const code = fs.readFileSync('test-wasm/demo_user_reply.opt.wasm');
  const meta = await getWasmMetadata(fs.readFileSync('test-wasm/demo_user_reply.meta.wasm'));
  const bobReply = (messageId: string) => {
    api.reply.submitReply({ toId: messageId, payload: 'Hello Alice', gasLimit: 200_000_000 }, meta);
    api.reply.signAndSend(bob, (data) => {});
  };

  const programId = api.program.submit({ code, initPayload: u8aToHex(bob.addressRaw), gasLimit: 100_000_000 }, meta);

  api.gearEvents.subscribeLogEvents(({ data }) => {
    console.log(data.toHuman());
    if (data.source.toHex() === programId && data.dest.toHex() === u8aToHex(bob.addressRaw)) {
      bobReply(data.id.toHex());
    }
    if (data.reply.isSome && data.reply.unwrap()[0].toHex() === messageId) {
      endPromiseResolve();
    }
  });

  await api.program.signAndSend(alice, (data) => {});
  console.log(meta);
  api.message.submit({ destination: programId, payload: 'Hello Bob', gasLimit: 200_000_000 }, meta);
  await api.message.signAndSend(alice, (data) => {
    messageId = data.messageId.messageId;
  });
  return endPromise;
}

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => process.exit());
