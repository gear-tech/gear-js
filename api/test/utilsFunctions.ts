import {
  createEventClass,
  GearApi,
  GearKeyring,
  Hex,
  IGearEvent,
  MessageWaitedData,
  UserMessageSent,
  UserMessageSentData,
} from '../src';

export const checkInit = (api: GearApi, programId: string) => {
  let unsubs = [];
  let messageId = undefined;
  const resultPromise = Promise.race([
    new Promise((resolve) => {
      unsubs.push(
        api.gearEvents.subscribeToGearEvent('ProgramChanged', (event) => {
          if (event.data.id.toHex() === programId) {
            if (event.data.change.isActive) {
              resolve('success');
            }
          }
        }),
      );
    }),
    new Promise((resolve) => {
      unsubs.push(
        api.gearEvents.subscribeToGearEvent('UserMessageSent', (event) => {
          if (event.data.source.toHex() === programId) {
            if (event.data.reply.unwrap()[0].toHex() === messageId && event.data.reply.unwrap()[1].toNumber() !== 0) {
              resolve('failed');
            }
          }
        }),
      );
    }),
  ]);
  unsubs.push(
    api.gearEvents.subscribeToGearEvent('MessageEnqueued', (event) => {
      if (event.data.destination.toHex() === programId && event.data.entry.isInit) {
        messageId = event.data.id.toHex();
      }
    }),
  );
  return async () => {
    const result = await resultPromise;
    for (let unsubPromise of unsubs) {
      const unsub = await unsubPromise;
      unsub();
    }
    return result;
  };
};

export const listenToUserMessageSent = (api: GearApi, programId: Hex) => {
  const messages: UserMessageSent[] = [];
  const unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', (event) => {
    if (event.data.source.toHex() === programId) {
      messages.push(event);
    }
  });
  return async (messageId: Hex): Promise<UserMessageSentData> => {
    const message = messages.find(({ data: { reply } }) => reply.isSome && reply.unwrap()[0].toHex() === messageId);
    (await unsub)();
    return message?.data;
  };
};

export const sendTransaction = async (submitted: any, account: any, methodName: keyof IGearEvent): Promise<any> => {
  return new Promise((resolve, reject) => {
    submitted
      .signAndSend(account, ({ events = [] }) => {
        events.forEach(({ event: { method, data } }) => {
          if (method === methodName) {
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
  api.gearEvents.subscribeToGearEvent('MessageWaited', (event) => {
    messages.push(event.data);
  });
  return (messageId: Hex) => {
    const message = messages.find(({ id }) => id.toHex() === messageId);
    return message;
  };
};
