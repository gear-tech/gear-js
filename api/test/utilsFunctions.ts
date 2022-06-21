import { UnsubscribePromise } from '@polkadot/api/types';
import {
  GearApi,
  GearKeyring,
  Hex,
  IGearEvent,
  MessageWaitedData,
  UserMessageSent,
  UserMessageSentData,
  MessageEnqueued,
  MessagesDispatched,
  ProgramChanged,
} from '../src';

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
            for (let [id, status] of mdEvent.data.statuses) {
              if (id.eq(messageId)) {
                if (status.isFailed) {
                  reject('failed');
                  break;
                }
              }
            }
            break;
          case 'ProgramChanged':
            const pcEvent = event as ProgramChanged;
            if (pcEvent.data.id.eq(programId) && pcEvent.data.change.isActive) {
              resolve('success');
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

export const listenToUserMessageSent = (api: GearApi, programId: Hex) => {
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
      }) => (messageId === null ? reply.isNone : reply.isSome && reply.unwrap()[0].eq(messageId)),
    );
    (await unsub)();
    if (!message) {
      throw new Error(`UserMessageSent not found`);
    }
    return message.data;
  };
};

export const sendTransaction = async (submitted: any, account: any, methodName: keyof IGearEvent): Promise<any> => {
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
};

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
