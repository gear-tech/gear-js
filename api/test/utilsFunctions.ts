import { SubmittableExtrinsic, UnsubscribePromise } from '@polkadot/api/types';
import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';

import { GearApi, GearTransaction, IGearEvent, IGearVoucherEvent, MessageWaitedData, ProgramChangedData } from '../src';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';

export const checkInit = (
  api: GearApi,
  programId: string,
  cb?: (status: 'ProgramSet' | 'Active' | 'Terminated', expiration?: number) => void,
) => {
  let unsub: UnsubscribePromise;

  return new Promise((resolve, reject) => {
    unsub = api.gearEvents.subscribeToGearEvent('ProgramChanged', ({ data }) => {
      if (data.id.eq(programId)) {
        if (data.change.isProgramSet) {
          cb && cb('ProgramSet', data.change.asProgramSet.expiration.toNumber());
        } else if (data.change.isActive) {
          cb && cb('Active', data.change.asActive.expiration.toNumber());
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

export async function sendTransaction<E extends keyof IGearEvent | keyof IGearVoucherEvent | 'Transfer'>(
  submitted: GearTransaction | SubmittableExtrinsic<'promise'>,
  account: KeyringPair,
  methods: E[],
): Promise<any[]> {
  const result: any = new Array(methods.length);
  return new Promise((resolve, reject) => {
    submitted
      .signAndSend(account, ({ events, status }) => {
        events.forEach(({ event }) => {
          const { method, data } = event;
          if (methods.includes(method as E) && status.isInBlock) {
            result[methods.indexOf(method as E)] = data;
          } else if (method === 'ExtrinsicFailed') {
            reject(data.toString());
          }
        });
        if (status.isInBlock) {
          resolve([...result, status.asInBlock.toHex()]);
        }
      })
      .catch((err) => {
        console.log(err);
        reject(err.message);
      });
  });
}

export const getAccount = async (uri: string) => {
  await waitReady();
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 137 });
  return keyring.addFromUri(uri);
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

export const waitForPausedProgram = (
  api: GearApi,
  programId: HexString,
  blockNumber: number,
): Promise<[HexString, HexString]> => {
  return new Promise((resolve) => {
    const unsub = api.derive.chain.subscribeNewBlocks(({ block, events }) => {
      if (block.header.number.eq(blockNumber)) {
        const event = events.filter(
          ({ event: { method, data } }) =>
            method === 'ProgramChanged' &&
            (data as ProgramChangedData).id.eq(programId) &&
            (data as ProgramChangedData).change.isPaused,
        );
        unsub.then((fn) => fn());
        resolve([(event[0].event.data as ProgramChangedData).id.toHex(), block.header.hash.toHex()]);
      }
    });
  });
};
