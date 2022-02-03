import { u8aToHex } from '@polkadot/util';
import { GearMailbox, GearApi, GearKeyring, getWasmMetadata, Metadata } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import * as fs from 'fs';
// import { messageToBob, uploadDemoReply } from './message-reply';

export const uploadDemoReply = async (api: GearApi, keyring: KeyringPair, payload: string) => {
  const code = fs.readFileSync('test-wasm/demo_user_reply.opt.wasm');
  const meta = await getWasmMetadata(fs.readFileSync('test-wasm/demo_user_reply.meta.wasm'));

  const programId = api.program.submit({ code, initPayload: payload, gasLimit: 100_000_000 }, meta, meta.init_input);
  await api.program.signAndSend(keyring, (data) => {});
  return { programId, meta };
};

export const messageToBob = async (
  api: GearApi,
  keyring: KeyringPair,
  programId: string,
  meta: Metadata,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    api.message.submit(
      { destination: programId, payload: 'Hello Bob', gasLimit: 200_000_000 },
      meta,
      meta.handle_input,
    );
    await api.message.signAndSend(keyring, (data) => {
      console.log(data);
      resolve(data.messageId);
    });
  });
};

export const readMailbox = async () => {
  const api = await GearApi.create();
  const mailbox = new GearMailbox(api);
  const alice = await GearKeyring.fromSuri('//Alice');
  const bob = await GearKeyring.fromSuri('//Bob');
  const { programId, meta } = await uploadDemoReply(api, alice, u8aToHex(bob.addressRaw));

  await messageToBob(api, alice, programId, meta);

  const read = await mailbox.readMailbox(u8aToHex(bob.addressRaw));

  if (read.isSome) {
    read.unwrap().forEach(({ source, dest }, key) => {
      console.log(key.toHex());
      console.log(`destination: ${dest.toHex()}\nsource: ${source.toHex()}`);
    });
  }
};
