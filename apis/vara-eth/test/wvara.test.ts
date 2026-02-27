import type { Chain, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { createPublicClient, createWalletClient, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { walletClientToSigner } from '../src/signer/index.js';
import { config } from './config';
import { getWrappedVaraClient, RouterClient, type WrappedVaraClient } from '../src';

let publicClient: PublicClient<WebSocketTransport, Chain, undefined>;
let walletClient: WalletClient<WebSocketTransport>;
let signer: ReturnType<typeof walletClientToSigner>;
let router: RouterClient;
let wvara: WrappedVaraClient;

beforeAll(async () => {
  const transport = webSocket(config.wsRpc);

  publicClient = createPublicClient({
    transport,
  }) as PublicClient<WebSocketTransport, Chain, undefined>;
  const account = privateKeyToAccount(config.privateKey);

  walletClient = createWalletClient({
    account,
    transport,
  }) as WalletClient<WebSocketTransport>;
  signer = walletClientToSigner(walletClient);

  router = new RouterClient({ publicClient, signer, address: config.routerId });
  wvara = getWrappedVaraClient({ publicClient, signer, address: await router.wrappedVara() });
});

describe('view functions', () => {
  test('should get wrapped Vara address from router', async () => {
    const wrappedVaraAddr = await router.wrappedVara();
    expect(wrappedVaraAddr).toBeDefined();
    expect(typeof wrappedVaraAddr).toBe('string');
    expect(wrappedVaraAddr).toBe(wvara.address);
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
    const balance = await wvara.balanceOf(await signer.getAddress());
    expect(balance).toBeDefined();
    expect(typeof balance).toBe('bigint');
    expect(balance).toBeGreaterThan(0n);
  });

  test('should get allowance', async () => {
    const addr = await signer.getAddress();
    const allowance = await wvara.allowance(addr, addr);
    expect(allowance).toBeDefined();
    expect(typeof allowance).toBe('bigint');
    expect(allowance).toBeGreaterThanOrEqual(0n);
  });
});

describe('transactions', () => {
  test('should approve token spending', async () => {
    const tx = await wvara.approve(await signer.getAddress(), BigInt(1000));

    await tx.send();

    const approvalLog = await tx.getApprovalLog();

    expect(approvalLog).toBeDefined();
    expect(approvalLog.owner).toBeDefined();
    expect(approvalLog.spender).toBeDefined();
    expect(approvalLog.value).toBe(BigInt(1000));
  });

  test('should verify allowance after approval', async () => {
    const addr = await signer.getAddress();
    const allowance = await wvara.allowance(addr, addr);
    expect(allowance).toBeGreaterThanOrEqual(BigInt(1000));
  });

  test('should transfer tokens', async () => {
    const amount = BigInt(2000 * 1e12);
    const tx = await wvara.transfer('0xBcd4042DE499D14e55001CcbB24a551F3b954096', amount);

    await tx.send();

    const transferLog = await tx.getTransferLog();

    expect(transferLog).toBeDefined();
    expect(transferLog.from).toBeDefined();
    expect(transferLog.to).toBeDefined();
    expect(transferLog.value).toBe(amount);
  });
});
