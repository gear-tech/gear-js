import { SubmittableExtrinsic, UnsubscribePromise } from '@polkadot/api/types';
import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';

import {
  GearApi,
  GearKeyring,
  GearTransaction,
  IGearEvent,
  MessageWaitedData,
  UserMessageSent,
  UserMessageSentData,
} from '../src';

export const checkInit = (
  api: GearApi,
  programId: string,
  cb?: (status: 'ProgramSet' | 'Active' | 'Terminated') => void,
) => {
  let unsub: UnsubscribePromise;

  return new Promise((resolve, reject) => {
    unsub = api.gearEvents.subscribeToGearEvent('ProgramChanged', ({ data }) => {
      if (data.id.eq(programId)) {
        if (data.change.isProgramSet) {
          cb && cb('ProgramSet');
        } else if (data.change.isActive) {
          cb && cb('Active');
          unsub.then((fn) => fn());
          resolve('success');
        } else if (data.change.isTerminated) {
          cb && cb('Terminated');
          unsub.then((fn) => fn());
          reject(new Error('Program is terminated'));
        } else {
          reject(new Error(`Unexpected program status: ${data.change.toHuman()}`));
        }
      }
    });
  });
};

export function listenToUserMessageSent(api: GearApi, programId: HexString) {
  const messages: UserMessageSent[] = [];
  const unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', (event) => {
    if (event.data.message.source.eq(programId)) {
      messages.push(event);
    }
  });
  return async (messageId: HexString | null): Promise<UserMessageSentData> => {
    const message = messages.find(
      ({
        data: {
          message: { details },
        },
      }) => {
        if (messageId === null) {
          return details.isNone;
        }

        if (details.isSome) {
          return details.unwrap().isReply && details.unwrap().asReply.replyTo.eq(messageId);
        } else {
          return false;
        }
      },
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
  return async (messageId: HexString): Promise<MessageWaitedData> => {
    const message = messages.find(({ id }) => id.eq(messageId));
    (await unsub)();
    if (!message) {
      throw new Error('MessageWaited not found');
    }
    return message;
  };
};
