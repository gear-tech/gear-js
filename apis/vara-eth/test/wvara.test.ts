import type { Chain, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { createPublicClient, createWalletClient, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { EthereumClient } from '../src';
import { walletClientToSigner } from '../src/signer/index.js';
import { config } from './config';

let publicClient: PublicClient<WebSocketTransport, Chain, undefined>;
let walletClient: WalletClient<WebSocketTransport>;
let signer: ReturnType<typeof walletClientToSigner>;
let ethereumClient: EthereumClient;

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
  ethereumClient = new EthereumClient(publicClient, signer, config.routerId);
  await ethereumClient.waitForInitialization();
});

describe('view functions', () => {
  test('should get wrapped Vara address from router', async () => {
    const wrappedVaraAddr = await ethereumClient.router.wrappedVara();
    expect(wrappedVaraAddr).toBeDefined();
    expect(typeof wrappedVaraAddr).toBe('string');
    expect(wrappedVaraAddr).toBe(ethereumClient.wvara.address);
  });

  test('should get name', async () => {
    const name = await ethereumClient.wvara.name();
    expect(name).toBeDefined();
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  test('should get symbol', async () => {
    const symbol = await ethereumClient.wvara.symbol();
    expect(symbol).toBeDefined();
    expect(typeof symbol).toBe('string');
    expect(symbol.length).toBeGreaterThan(0);
  });

  test('should get decimals', async () => {
    const decimals = await ethereumClient.wvara.decimals();
    expect(decimals).toBeDefined();
    expect(typeof decimals).toBe('number');
    expect(decimals).toBeGreaterThanOrEqual(0);
  });

  test('should get total supply', async () => {
    const totalSupply = await ethereumClient.wvara.totalSupply();
    expect(totalSupply).toBeDefined();
    expect(typeof totalSupply).toBe('bigint');
    expect(totalSupply).toBeGreaterThanOrEqual(0n);
  });

  test('should get account balance', async () => {
    const balance = await ethereumClient.wvara.balanceOf(await ethereumClient.signer.getAddress());
    expect(balance).toBeDefined();
    expect(typeof balance).toBe('bigint');
    expect(balance).toBeGreaterThan(0n);
  });

  test('should get allowance', async () => {
    const allowance = await ethereumClient.wvara.allowance(
      await ethereumClient.signer.getAddress(),
      await ethereumClient.signer.getAddress(),
    );
    expect(allowance).toBeDefined();
    expect(typeof allowance).toBe('bigint');
    expect(allowance).toBeGreaterThanOrEqual(0n);
  });
});

describe('transactions', () => {
  test('should approve token spending', async () => {
    const tx = await ethereumClient.wvara.approve(await ethereumClient.signer.getAddress(), BigInt(1000));

    await tx.send();

    const approvalLog = await tx.getApprovalLog();

    expect(approvalLog).toBeDefined();
    expect(approvalLog.owner).toBeDefined();
    expect(approvalLog.spender).toBeDefined();
    expect(approvalLog.value).toBe(BigInt(1000));
  });

  test('should verify allowance after approval', async () => {
    const allowance = await ethereumClient.wvara.allowance(
      await ethereumClient.signer.getAddress(),
      await ethereumClient.signer.getAddress(),
    );
    expect(allowance).toBeGreaterThanOrEqual(BigInt(1000));
  });

  test('should transfer tokens', async () => {
    const amount = BigInt(2000 * 1e12);
    const tx = await ethereumClient.wvara.transfer('0xBcd4042DE499D14e55001CcbB24a551F3b954096', amount);

    await tx.send();

    const transferLog = await tx.getTransferLog();

    expect(transferLog).toBeDefined();
    expect(transferLog.from).toBeDefined();
    expect(transferLog.to).toBeDefined();
    expect(transferLog.value).toBe(amount);
  });
});
