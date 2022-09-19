import { SubmittableExtrinsic, UnsubscribePromise } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  GearApi,
  GearKeyring,
  IGearEvent,
  MessageWaitedData,
  UserMessageSent,
  UserMessageSentData,
  MessageEnqueued,
  MessagesDispatched,
  GearTransaction,
} from '../src';
import { Hex } from '../src/types';

export const checkInit = (api: GearApi, programId: string) => {
  let unsub: UnsubscribePromise;
  let messageId: Hex;
  const initPromise = new Promise((resolve, reject) => {
    unsub = api.query.system.events((events) => {
      events.forEach(({ event }) => {
        switch (event.method) {
          case 'MessageEnqueued':
            const meEvent = event as MessageEnqueued;
            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }
            break;
          case 'MessagesDispatched':
            const mdEvent = event as MessagesDispatched;
            for (const [id, status] of mdEvent.data.statuses) {
              if (id.eq(messageId)) {
                if (status.isFailed) {
                  reject('failed');
                  break;
                }
                if (status.isSuccess) {
                  resolve('success');
                  break;
                }
              }
            }
            break;
        }
      });
    });
  });

  return async () => {
    const result = await initPromise;
    (await unsub)();
    return result;
  };
};

export function listenToUserMessageSent(api: GearApi, programId: Hex) {
  const messages: UserMessageSent[] = [];
  const unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', (event) => {
    if (event.data.message.source.eq(programId)) {
      messages.push(event);
    }
  });
  return async (messageId: Hex | null): Promise<UserMessageSentData> => {
    const message = messages.find(
      ({
        data: {
          message: { reply },
        },
      }) => (messageId === null ? reply.isNone : reply.isSome && reply.unwrap().replyTo.eq(messageId)),
    );
    (await unsub)();
    if (!message) {
      throw new Error('UserMessageSent not found');
    }
    return message.data;
  };
}

export async function sendTransaction<E extends keyof IGearEvent = keyof IGearEvent>(
  submitted: GearTransaction | SubmittableExtrinsic<'promise'>,
  account: KeyringPair,
  methodName: E,
): Promise<any> {
  return new Promise((resolve, reject) => {
    submitted
      .signAndSend(account, ({ events, status }) => {
        events.forEach(({ event: { method, data } }) => {
          if (method === methodName && status.isFinalized) {
            resolve(data.toHuman());
          } else if (method === 'ExtrinsicFailed') {
            reject(data.toString());
          }
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err.message);
      });
  });
}

export const getAccount = () => {
  return Promise.all([GearKeyring.fromSuri('//Alice'), GearKeyring.fromSuri('//Bob')]);
};

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const describeif = (condition: boolean) => (condition ? describe : describe.skip);

export const testif = (condition: boolean) => (condition ? test : test.skip);

export const listenToMessageWaited = (api: GearApi) => {
  const messages: MessageWaitedData[] = [];
  const unsub = api.gearEvents.subscribeToGearEvent('MessageWaited', (event) => {
    messages.push(event.data);
  });
  return async (messageId: Hex): Promise<MessageWaitedData> => {
    const message = messages.find(({ id }) => id.eq(messageId));
    (await unsub)();
    if (!message) {
      throw new Error('MessageWaited not found');
    }
    return message;
  };
};
