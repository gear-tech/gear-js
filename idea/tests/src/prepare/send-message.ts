import { readFileSync } from 'fs';
import { GearApi, getWasmMetadata, Hex } from '@gear-js/api';

import accounts from '../config/accounts';
import { IMessageSpec, IPreparedPrograms } from '../interfaces';
import { listenToUserMessageSent } from './subscriptions';
import { checkUserMessageSent, checkMessages } from './check';
import { sleep } from '../utils';

async function sendMessage(api: GearApi, destination: Hex, spec: IMessageSpec) {
  const meta = spec.pathToMeta ? await getWasmMetadata(readFileSync(spec.pathToMeta)) : undefined;
  const account = (await accounts())[spec.account];
  api.message.send(
    { destination, payload: spec.payload, gasLimit: spec.gasLimit, value: spec.value },
    meta,
    spec.metaType,
  );

  return new Promise((resolve) => {
    api.message.signAndSend(account, ({ events = [] }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === 'ExtrinsicFailed') {
          throw new Error(`Unable to send message. ExtrinsicFailed. ${data.toString()}`);
        } else if (method === 'MessageEnqueued') {
          resolve(data.toHuman());
        }
      });
    });
  });
}

export async function sendMessages(
  api: GearApi,
  messages: { [program: string]: IMessageSpec[] },
  uploadedPrograms: IPreparedPrograms,
) {
  const sentMessages = new Map<number, any>();
  const logs = new Map<Hex, any>();
  const unsub = await listenToUserMessageSent(api, (data) => {
    logs.set(data.message.id.toHex(), data.toHuman());
  });
  for (const program of Object.keys(messages)) {
    for (const message of messages[program]) {
      sentMessages.set(
        message.id,
        await sendMessage(
          api,
          Object.values(uploadedPrograms).find((value) => value.spec.name === program).id,
          message,
        ),
      );
    }
  }

  await sleep();
  unsub();
  return { sent: checkMessages(sentMessages, messages), log: checkUserMessageSent(messages, logs) };
}
