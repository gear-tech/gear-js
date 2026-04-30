import * as fs from 'node:fs';
import path from 'node:path';
import type { Abi, Account, Chain, Hex, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { createPublicClient, createWalletClient, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
  getMirrorClient,
  getRouterClient,
  getWrappedVaraClient,
  type ITransactionSigner,
  type RouterClient,
  type WrappedVaraClient,
} from '../src';
import { walletClientToSigner } from '../src/signer';
import { config } from './config';

let publicClient: PublicClient;
let walletClient: WalletClient<WebSocketTransport, Chain, Account>;
let signer: ITransactionSigner;
let router: RouterClient;
let wvara: WrappedVaraClient;
let abiContractAddr: Hex;
let initialProgramsCount: bigint;

beforeAll(async () => {
  const transport = webSocket(config.wsRpc);

  publicClient = createPublicClient({ transport });

  const account = privateKeyToAccount(config.privateKey);

  walletClient = createWalletClient({ account, transport });
  signer = walletClientToSigner(walletClient);
  router = getRouterClient({ publicClient, signer, address: config.routerId });
  wvara = getWrappedVaraClient({ publicClient, signer, address: await router.wrappedVara() });

  initialProgramsCount = await router.programsCount();

  const {
    abi,
    bytecode: { object: bytecode },
  } = JSON.parse(fs.readFileSync(path.join(config.solOut, 'Counter.sol', 'CounterAbi.json'), 'utf-8')) as {
    abi: Abi;
    bytecode: { object: Hex };
  };

  const deployHash = await walletClient.deployContract({ abi, bytecode });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });

  if (!receipt.contractAddress) throw new Error('Counter ABI deployment failed');

  abiContractAddr = receipt.contractAddress.toLowerCase() as Hex;
}, config.longRunningTestTimeout * 3);

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
});

describe('CreateProgramBuilder', () => {
  const codeId = config.codeId;

  test('should create program', async () => {
    const tx = router.createProgramBuilder(codeId).build();

    await tx.send();

    const programId = await tx.getProgramId();
    const mirror = getMirrorClient({ address: programId, signer, publicClient });

    expect((await mirror.router()).toLowerCase()).toBe(config.routerId);
  });

  test('should create program with explicit salt', async () => {
    const salt = `0x${'ab'.repeat(32)}` as Hex;
    const tx = router.createProgramBuilder(codeId).withSalt(salt).build();

    await tx.send();

    const programId = await tx.getProgramId();

    expect(programId).toBeDefined();
  });

  test('should create program with override initializer', async () => {
    const tx = router.createProgramBuilder(codeId).withOverrideInitializer(walletClient.account.address).build();

    await tx.send();

    const programId = await tx.getProgramId();

    expect(programId).toBeDefined();
  });

  test('should create program with abi interface', async () => {
    const tx = router.createProgramBuilder(codeId).withAbiInterface(abiContractAddr).build();

    const receipt = await tx.sendAndWaitForReceipt();

    expect(receipt.blockHash).toBeDefined();
  });

  test('should create program with executable balance', async () => {
    const initialExecutableBalance = 100n;
    const deadline = BigInt(Date.now() + 10_000);
    const { signature } = await wvara.prepareAndSignPermitData(router.address, initialExecutableBalance, deadline);

    const tx = router
      .createProgramBuilder(codeId)
      .withExecutableBalance(initialExecutableBalance, deadline, signature)
      .build();

    const receipt = await tx.sendAndWaitForReceipt();

    expect(receipt.blockHash).toBeDefined();

    const programId = await tx.getProgramId();
    const mirror = getMirrorClient({ address: programId, signer, publicClient });

    expect((await mirror.router()).toLowerCase()).toBe(config.routerId);
  });

  test('should create program with abi interface and executable balance', async () => {
    const initialExecutableBalance = 100n;
    const deadline = BigInt(Date.now() + 10_000);
    const { signature } = await wvara.prepareAndSignPermitData(router.address, initialExecutableBalance, deadline);

    const tx = router
      .createProgramBuilder(codeId)
      .withAbiInterface(abiContractAddr)
      .withExecutableBalance(initialExecutableBalance, deadline, signature)
      .build();

    const receipt = await tx.sendAndWaitForReceipt();

    expect(receipt.blockHash).toBeDefined();

    const programId = await tx.getProgramId();
    const mirror = getMirrorClient({ address: programId, signer, publicClient });

    expect((await mirror.router()).toLowerCase()).toBe(config.routerId);
  });

  test('should return correct programs count after all programs are created', async () => {
    const count = await router.programsCount();

    expect(count).toBe(initialProgramsCount + 6n);
  });
});
