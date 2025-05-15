import { Wallet } from 'ethers';
import { config } from './config';
import { getRouterContract, getWrappedVaraContract } from '../src';
import { ethWsProvider } from './common';

const { privateKey, routerId } = config;

const wallet = new Wallet(privateKey, ethWsProvider());
const router = getRouterContract(routerId, wallet);

afterAll(() => {
  wallet.provider!.destroy();
});

describe('Account', () => {
  test('check account balance', async () => {
    const wrappedVaraAddr = await router.wrappedVara();

    const wVara = getWrappedVaraContract(wrappedVaraAddr, wallet);

    const balance = await wVara.balanceOf(wallet.address);

    expect(balance).toBeGreaterThan(0);
  });
});
