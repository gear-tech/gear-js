import { GearApi, TransferData } from '../src';
import { getAccount, sleep } from './utilsFunctions';
import { WS_ADDRESS } from './config';

const api = new GearApi({ providerAddress: WS_ADDRESS });
let alice, bob;

beforeAll(async () => {
  await api.isReadyOrError;
  alice = await getAccount('//Alice');
  bob = await getAccount('//Bob');
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Transfer balance', () => {
  test('Transfer balance', async () => {
    api.balance.transfer(bob.address, 10000);

    const transferData: TransferData = await new Promise((resolve, reject) => {
      api.balance.signAndSend(alice, ({ events }) => {
        events.forEach(({ event: { method, data } }) => {
          if (method === 'Transfer') {
            resolve(data as TransferData);
          } else if (method === 'ExtrinsicFailed') {
            reject(data);
          }
        });
      });
    });
    expect(transferData).toHaveProperty('from');
    expect(transferData).toHaveProperty('to');
    expect(transferData).toHaveProperty('amount');
  });
});
