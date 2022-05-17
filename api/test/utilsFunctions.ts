import { GearApi, GearKeyring, ProgramId } from '../src';

export const checkLog = (event: any, programId: ProgramId, messageId: string) => {
  if (event.data[0].source.toHex() === programId) {
    if (event.data[0].reply.unwrap()[0].toHex() === messageId) {
      return event.data[0].reply.unwrap()[1].toNumber();
    }
  }
  return undefined;
};

export const checkInit = (api: GearApi, programId: string) => {
  return new Promise((resolve) => {
    api.gearEvents.subscribeToProgramEvents((event) => {
      if (event.data.info.programId.toHex() === programId) {
        if (api.events.gear.InitSuccess.is(event)) {
          resolve('success');
        } else {
          resolve('failed');
        }
      }
    });
  });
};

export const sendTransaction = async (submitted: any, account: any, methodName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    submitted.signAndSend(account, ({ events = [] }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === 'ExtrinsicFailed') {
          reject(data.toString());
        } else if (method === methodName) {
          resolve(data[0].toHuman());
        }
      });
    });
  });
};

export const getAccount = () => {
  return Promise.all([GearKeyring.fromSuri('//Alice'), GearKeyring.fromSuri('//Bob')]);
};

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const describeif = (condition: boolean) => (condition ? describe : describe.skip);
export const testif = (condition: boolean) => (condition ? test : test.skip);
