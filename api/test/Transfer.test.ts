import { GearApi, TransferData } from '../src';
import { getAccount, sleep } from './utilsFunctions';

const api = new GearApi();
let alice, bob;

beforeAll(async () => {
  await api.isReadyOrError;
  [alice, bob] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Subscribe to balance transfer events', () => {
  test('Transfer balance', async () => {
    const subsribeTransfer = new Promise((resolve) => {
      api.gearEvents.subscribeToTransferEvents((event) => {
        resolve(event.data);
      });
    });

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

    const subsribeTransferData = (await subsribeTransfer) as TransferData;
    expect(transferData.from.toHex()).toBe(subsribeTransferData.from.toHex());
    expect(transferData.to.toHex()).toBe(subsribeTransferData.to.toHex());
    expect(transferData['amount'].toHex()).toBe(subsribeTransferData['amount'].toHex());
  });
});
