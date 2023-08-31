import { readFileSync } from 'fs';
import { GearApi, ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import accounts from '../config/accounts';
import { HumanMessageQueuedData, IMessageSpec, IPreparedPrograms } from '../interfaces';
import { listenToUserMessageSent } from './subscriptions';
import { checkMessages, checkUserMessageSent } from './check';
import { sleep } from '../utils';

async function sendMessage(api: GearApi, destination: HexString, spec: IMessageSpec): Promise<HumanMessageQueuedData> {
  const metaHex: HexString = `0x${readFileSync(spec.pathToMetaTxt, 'utf-8')}`;
  const metaData = ProgramMetadata.from(metaHex);

  const account = (await accounts())[spec.account];

  await api.message.send({ destination, payload: spec.payload, gasLimit: spec.gasLimit, value: spec.value }, metaData);

  return new Promise((resolve) => {
    api.message.signAndSend(account, ({ events = [], status }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === 'ExtrinsicFailed') {
          throw new Error(`Unable to send message. ExtrinsicFailed. ${data.toString()}`);
        } else if (method === 'MessageQueued' && status.isFinalized) {
          resolve(data.toHuman() as unknown as HumanMessageQueuedData);
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
  const sentMessages = new Map<number, HumanMessageQueuedData>();
  const recievedMessages = new Map<HexString, any>();
  const unsub = await listenToUserMessageSent(api, (data) => {
    recievedMessages.set(data.message.id.toHex(), data.toHuman());
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
  return { sent: checkMessages(sentMessages, messages), log: checkUserMessageSent(messages, recievedMessages) };
}
