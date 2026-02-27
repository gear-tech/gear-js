import type { Account, Chain, Hex, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { createPublicClient, createWalletClient, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { deployContract } from 'viem/actions';
import fs from 'node:fs';

import { getMirrorClient, VaraEthApi, HttpVaraEthProvider, createVaraEthApi, type ITransactionSigner } from '../src';
import { hasProps, waitNBlocks } from './common';
import { config } from './config';
import { walletClientToSigner } from '../src/signer';

let api: VaraEthApi;
let publicClient: PublicClient<WebSocketTransport, Chain, undefined>;
let walletClient: WalletClient<WebSocketTransport, Chain, Account>;
let signer: ITransactionSigner;
let mirror: ReturnType<typeof getMirrorClient>;

let programId: `0x${string}`;

beforeAll(async () => {
  const transport = webSocket(config.wsRpc);

  publicClient = createPublicClient({
    transport,
  }) as PublicClient<WebSocketTransport, Chain, undefined>;
  const account = privateKeyToAccount(config.privateKey);

  walletClient = createWalletClient({
    account,
    transport,
  });
  signer = walletClientToSigner(walletClient);

  api = await createVaraEthApi(new HttpVaraEthProvider(), publicClient, config.routerId, signer);
});

afterAll(async () => {
  await api.provider.disconnect();
});

describe('setup', () => {
  let counterAbiContractAddress: Hex;
  let programWithAbiInterfaceId: Hex;

  test('should create program', async () => {
    const tx = await api.eth.router.createProgram(config.codeId);
    await tx.sendAndWaitForReceipt();

    programId = await tx.getProgramId();

    expect(programId).toBeDefined();

    mirror = getMirrorClient({ address: programId, signer, publicClient });
  });

  test(
    'should wait for programId appeared on Vara.Eth',
    async () => {
      expect(programId).toBeDefined();
      let id = null;
      while (id === null) {
        const ids = await api.query.program.getIds();
        if (ids.includes(programId)) {
          id = programId;
        } else {
          await waitNBlocks(1);
        }
      }

      const ids = await api.query.program.getIds();
      if (!ids.includes(programId)) {
        process.exit(1);
      }
      expect(ids).toContain(programId);
    },
    config.longRunningTestTimeout,
  );

  test('should approve wvara', async () => {
    const tx = await api.eth.wvara.approve(programId, BigInt(100 * 1e12));

    await tx.send();

    const approvalData = await tx.getApprovalLog();

    hasProps(approvalData, ['owner', 'spender', 'value']);

    expect(approvalData.value).toEqual(BigInt(100 * 1e12));

    const allowance = await api.eth.wvara.allowance(await signer.getAddress(), programId);
    expect(allowance).toEqual(BigInt(100 * 1e12));
  });

  test('should check that program is active', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('should deploy abi contract', async () => {
    const counter = JSON.parse(fs.readFileSync('./out/Counter.sol/CounterAbi.json', 'utf-8'));
    const txHash = await deployContract(walletClient, {
      abi: [],
      bytecode: counter.bytecode.object as Hex,
    });

    expect(txHash).toBeDefined();
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    expect(receipt.status).toBe('success');
    const contractAddress = receipt.contractAddress;

    expect(contractAddress).toBeDefined();
    counterAbiContractAddress = contractAddress as Hex;
  });

  test('should create program with abi interface', async () => {
    const tx = await api.eth.router.createProgramWithAbiInterface(config.codeId, counterAbiContractAddress);

    const receipt = await tx.sendAndWaitForReceipt();

    expect(receipt.status).toBe('success');

    const programId = await tx.getProgramId();
    expect(programId).toBeDefined();

    programWithAbiInterfaceId = programId;
  });

  test(
    'should wait for program with abi interface appeared on Vara.Eth',
    async () => {
      expect(programWithAbiInterfaceId).toBeDefined();
      let id = null;
      while (id === null) {
        const ids = await api.query.program.getIds();
        if (ids.includes(programWithAbiInterfaceId)) {
          id = programWithAbiInterfaceId;
        } else {
          await waitNBlocks(1);
        }
      }

      const ids = await api.query.program.getIds();
      if (!ids.includes(programWithAbiInterfaceId)) {
        process.exit(1);
      }
      expect(ids).toContain(programWithAbiInterfaceId);
    },
    config.longRunningTestTimeout,
  );
});

describe('view functions', () => {
  test('should get router address', async () => {
    const mirrorRouter = await mirror.router();
    expect(mirrorRouter).toBeDefined();
    expect(typeof mirrorRouter).toBe('string');
    expect(mirrorRouter.startsWith('0x')).toBe(true);
    expect(mirrorRouter.toLowerCase()).toBe(config.routerId);
  });

  test('should get state hash', async () => {
    const hash = await mirror.stateHash();
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.startsWith('0x')).toBe(true);
  });

  test('should get nonce', async () => {
    const nonce = await mirror.nonce();
    expect(nonce).toBeDefined();
    expect(typeof nonce).toBe('bigint');
    expect(nonce).toBeGreaterThanOrEqual(0n);
  });

  test('should get inheritor address', async () => {
    const inheritor = await mirror.inheritor();
    expect(inheritor).toBeDefined();
    expect(typeof inheritor).toBe('string');
    expect(inheritor.startsWith('0x')).toBe(true);
  });

  test('should get initializer address', async () => {
    const initializer = await mirror.initializer();
    expect(initializer).toBeDefined();
    expect(typeof initializer).toBe('string');
    expect(initializer.startsWith('0x')).toBe(true);
  });
});

describe('balance', () => {
  test(
    'should top up executable balance',
    async () => {
      const tx = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));

      let newStateHash: Hex | undefined = undefined;

      const currentStateHash = await mirror.stateHash();

      const unwatch = mirror.watchStateChangedEvent((stateHash) => {
        newStateHash = stateHash;
      });

      const { status } = await tx.sendAndWaitForReceipt();

      expect(status).toBe('success');

      while (!newStateHash) {
        await waitNBlocks(1);
      }

      expect(newStateHash).toBeDefined();
      expect(newStateHash).not.toEqual(currentStateHash);

      unwatch();
    },
    config.longRunningTestTimeout,
  );

  test('should check executable balance', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect(state).toHaveProperty(['executableBalance'], 10 * 1e12);
  });
});

describe('messages', () => {
  test(
    'should send init message',
    async () => {
      const payload = '0x24437265617465507267';

      const tx = await mirror.sendMessage(payload);

      await tx.send();

      const message = await tx.getMessage();

      hasProps(message, ['id', 'source', 'payload', 'value', 'callReply']);

      const { waitForReply } = await tx.setupReplyListener();

      const reply = await waitForReply();

      expect(reply.payload).toBe('0x');
      expect(reply.replyCode).toBe('0x00000000');
    },
    config.longRunningTestTimeout,
  );

  test('should check that program has active status after init', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test(
    'should send message and receive reply',
    async () => {
      const _payload = '0x1c436f756e74657224496e6372656d656e74';

      const tx = await mirror.sendMessage(_payload);

      await tx.send();

      const message = await tx.getMessage();

      hasProps(message, ['id', 'source', 'payload', 'value', 'callReply']);

      const { waitForReply } = await tx.setupReplyListener();

      const { payload, replyCode, value } = await waitForReply();

      expect(payload).toEqual('0x1c436f756e74657224496e6372656d656e7401000000');
      expect(replyCode).toBe('0x00010000');
      expect(value).toBe(0n);

      await waitNBlocks(1);
    },
    config.longRunningTestTimeout,
  );

  test(
    'should send message with value',
    async () => {
      // IncrementWithValue
      const _payload = '0x1c436f756e74657248496e6372656d656e745769746856616c7565';

      const tx = await mirror.sendMessage(_payload, 100n);

      await tx.send();

      const message = await tx.getMessage();

      hasProps(message, ['id', 'source', 'payload', 'value', 'callReply']);

      const { waitForReply } = await tx.setupReplyListener();

      const { payload, replyCode, value } = await waitForReply();

      expect(replyCode).toBe('0x00010000');
      expect(payload).toEqual('0x1c436f756e74657248496e6372656d656e745769746856616c756565000000');
      expect(value).toBe(0n);

      await waitNBlocks(1);
    },
    config.longRunningTestTimeout,
  );
});

describe('program state', () => {
  test('should read program state', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('should calculate reply for handle', async () => {
    const payload = '0x1c436f756e7465722047657456616c7565';

    const reply = await api.call.program.calculateReplyForHandle(await signer.getAddress(), programId, payload);

    expect(reply.payload).toBe('0x1c436f756e7465722047657456616c756565000000');
  });

  test('should fail calculateReplyForHandle for incorrect program id', async () => {
    const payload = '0x00';

    const addr = await signer.getAddress();
    await expect(api.call.program.calculateReplyForHandle(addr, addr, payload)).rejects.toThrow();
  });

  test('should get code id of the created program', async () => {
    expect(await api.query.program.codeId(programId)).toBe(config.codeId);
  });
});
