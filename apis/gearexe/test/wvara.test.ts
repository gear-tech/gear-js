import { createPublicClient, createWalletClient, webSocket } from 'viem';
import type { Chain, Hex, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { EthereumClient, getRouterClient, getWrappedVaraClient } from '../src';
import { config } from './config';

let publicClient: PublicClient<WebSocketTransport, Chain, undefined>;
let walletClient: WalletClient<WebSocketTransport>;
let ethereumClient: EthereumClient;
let router: ReturnType<typeof getRouterClient>;

let wrappedVaraAddr: Hex;
let wvara: ReturnType<typeof getWrappedVaraClient>;

beforeAll(async () => {
  const transport = webSocket(config.wsRpc);

  publicClient = createPublicClient<WebSocketTransport, Chain, undefined>({
    transport,
  }) as PublicClient<WebSocketTransport, Chain, undefined>;
  const account = privateKeyToAccount(config.privateKey);

  walletClient = createWalletClient<WebSocketTransport>({
    account,
    transport,
  });
  ethereumClient = new EthereumClient<WebSocketTransport>(publicClient, walletClient);
  router = getRouterClient(config.routerId, ethereumClient);
});

describe('view functions', () => {
  test('should get wrapped Vara address from router', async () => {
    wrappedVaraAddr = await router.wrappedVara();
    expect(wrappedVaraAddr).toBeDefined();
    expect(typeof wrappedVaraAddr).toBe('string');
    wvara = getWrappedVaraClient(wrappedVaraAddr, ethereumClient);
  });

  test('should get name', async () => {
    const name = await wvara.name();
    expect(name).toBeDefined();
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  test('should get symbol', async () => {
    const symbol = await wvara.symbol();
    expect(symbol).toBeDefined();
    expect(typeof symbol).toBe('string');
    expect(symbol.length).toBeGreaterThan(0);
  });

  test('should get decimals', async () => {
    const decimals = await wvara.decimals();
    expect(decimals).toBeDefined();
    expect(typeof decimals).toBe('number');
    expect(decimals).toBeGreaterThanOrEqual(0);
  });

  test('should get total supply', async () => {
    const totalSupply = await wvara.totalSupply();
    expect(totalSupply).toBeDefined();
    expect(typeof totalSupply).toBe('bigint');
    expect(totalSupply).toBeGreaterThanOrEqual(0n);
  });

  test('should get account balance', async () => {
    const balance = await wvara.balanceOf(ethereumClient.accountAddress);
    expect(balance).toBeDefined();
    expect(typeof balance).toBe('bigint');
    expect(balance).toBeGreaterThan(0n);
  });

  test('should get allowance', async () => {
    const allowance = await wvara.allowance(ethereumClient.accountAddress, ethereumClient.accountAddress);
    expect(allowance).toBeDefined();
    expect(typeof allowance).toBe('bigint');
    expect(allowance).toBeGreaterThanOrEqual(0n);
  });
});

describe('transactions', () => {
  test('should approve token spending', async () => {
    const tx = await wvara.approve(ethereumClient.accountAddress, BigInt(1000));

    await tx.send();

    const approvalLog = await tx.getApprovalLog();

    expect(approvalLog).toBeDefined();
    expect(approvalLog.owner).toBeDefined();
    expect(approvalLog.spender).toBeDefined();
    expect(approvalLog.value).toBe(BigInt(1000));
  });

  test('should verify allowance after approval', async () => {
    const allowance = await wvara.allowance(ethereumClient.accountAddress, ethereumClient.accountAddress);
    expect(allowance).toBeGreaterThanOrEqual(BigInt(1000));
  });
});
