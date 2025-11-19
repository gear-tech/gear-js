import { createPublicClient, createWalletClient, webSocket } from 'viem';
import type { Chain, Hex, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { execSync } from 'node:child_process';

import {
  EthereumClient,
  VaraEthApi,
  getMirrorClient,
  getRouterClient,
  getWrappedVaraClient,
  HttpVaraEthProvider,
} from '../src';
import { InjectedTransaction } from '../src/types';
import { hasProps, waitNBlocks } from './common';
import { config } from './config';

let api: VaraEthApi;
let publicClient: PublicClient<WebSocketTransport, Chain, undefined>;
let walletClient: WalletClient<WebSocketTransport>;
let ethereumClient: EthereumClient;

let router: ReturnType<typeof getRouterClient>;
let mirror: ReturnType<typeof getMirrorClient>;
let wvara: ReturnType<typeof getWrappedVaraClient>;

let programId: `0x${string}`;

beforeAll(async () => {
  const transport = webSocket(config.wsRpc);

  publicClient = createPublicClient<WebSocketTransport, Chain, undefined>({
    transport,
  }) as PublicClient<WebSocketTransport, Chain, undefined>;
  const prefundedAccount = privateKeyToAccount(config.wvaraPrefundedPrivateKey);
  const account = privateKeyToAccount(config.privateKey);

  walletClient = createWalletClient<WebSocketTransport>({
    account: prefundedAccount,
    transport,
  });
  ethereumClient = new EthereumClient<WebSocketTransport>(publicClient, walletClient);
  router = getRouterClient(config.routerId, ethereumClient);
  wvara = getWrappedVaraClient(await router.wrappedVara(), ethereumClient);

  const transferTx = await wvara.transfer(config.accountAddress, BigInt(50 * 1e12));
  await transferTx.sendAndWaitForReceipt();

  walletClient = createWalletClient({
    account,
    transport,
  });

  ethereumClient.setWalletClient(walletClient);

  api = new VaraEthApi(new HttpVaraEthProvider(), ethereumClient, config.routerId);
});

afterAll(async () => {
  await api.provider.disconnect();
});

describe('Injected Transactions', () => {
  describe.only('signature', () => {
    let injectedTxHash: string;
    let injectedTxSignature: string;
    let injectedMessageId: string;

    const INJECTED_TEST_PROGRAM_MANIFEST_PATH = 'programs/injected/Cargo.toml';

    const TX: InjectedTransaction = new InjectedTransaction({
      recipient: '0x0000000000000000000000000000000000000000',
      destination: '0x0000000000000000000000000000000000000000',
      payload: '0x000102',
      value: 256n,
      referenceBlock: '0x0000000000000000000000000000000000000000000000000000000000000000',
      salt: '0x030405',
    });

    const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

    beforeAll(() => {
      const result = execSync(`cargo run --manifest-path ${INJECTED_TEST_PROGRAM_MANIFEST_PATH}`, {
        stdio: 'pipe',
      });

      const resultStr = result.toString();

      const hash = resultStr.match('hash: <(0x[0-9a-f]{64})>')?.[1];
      if (!hash) {
        throw new Error('Hash not found in `injected` stdout');
      }
      const signature = resultStr.match('signature: <(0x[0-9a-f]*)>')?.[1];
      if (!signature) {
        throw new Error('Signature not found in `injected` stdout');
      }
      const messageId = resultStr.match('message_id: <(0x[0-9a-f]{64})>')?.[1];
      if (!messageId) {
        throw new Error('Message id not found in `injected` stdout');
      }
      injectedTxHash = hash;
      injectedTxSignature = signature;
      injectedMessageId = messageId;
    }, 5 * 60_000);

    test('should create a correct hash', () => {
      expect(TX.hash).toBe(injectedTxHash);
    });

    test('should create a correct message id', () => {
      expect(TX.messageId).toBe(injectedMessageId);
    });

    test('should create a correct signature', async () => {
      const account = privateKeyToAccount(PRIVATE_KEY);

      const signature = await account.sign({ hash: TX.hash });

      expect(signature).toBe(injectedTxSignature);
    });
  });

  describe('setup', () => {
    test('should create program', async () => {
      const tx = await router.createProgram(config.codeId);
      await tx.sendAndWaitForReceipt();

      programId = await tx.getProgramId();
      console.log(`Program id: ${programId}`);

      expect(programId).toBeDefined();

      mirror = getMirrorClient(programId, ethereumClient);
    });

    test(
      'should wait for programId appeared on Vara.Eth',
      async () => {
        let id = null;
        while (id === null) {
          const ids = await api.query.program.getIds();
          if (ids.includes(programId)) {
            id = programId;
          }
        }

        const ids = await api.query.program.getIds();
        if (!ids.includes(programId)) {
          process.exit(1);
        }
        expect(ids).toContain(programId);
      },
      config.blockTime * 20_000,
    );

    test('should approve wvara', async () => {
      const tx = await wvara.approve(programId, BigInt(10 * 1e12));

      await tx.send();

      const approvalData = await tx.getApprovalLog();

      hasProps(approvalData, ['owner', 'spender', 'value']);

      expect(approvalData.value).toEqual(BigInt(10 * 1e12));

      const allowance = await wvara.allowance(ethereumClient.accountAddress, programId);
      expect(allowance).toEqual(BigInt(10 * 1e12));
    });

    test('should check that program is active', async () => {
      const hash = await mirror.stateHash();

      const state = await api.query.program.readState(hash);

      expect('Active' in state.program).toBeTruthy();
    });

    test('should top up executable balance', async () => {
      const tx = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));

      const { status } = await tx.sendAndWaitForReceipt();

      expect(status).toBe('success');
    });

    test(
      'should send init message',
      async () => {
        const payload = '0x24437265617465507267';

        const tx = await mirror.sendMessage(payload);

        await tx.send();

        const message = await tx.getMessage();

        hasProps(message, ['id', 'source', 'payload', 'value', 'callReply']);

        const { waitForReply } = await tx.setupReplyListener();

        await waitForReply;
      },
      config.longRunningTestTimeout,
    );
  });

  describe('transactions', () => {
    let unwatch: () => void;

    let currentStateHash: Hex;
    let newStateHash: Hex;

    test('should read current state hash', async () => {
      currentStateHash = await mirror.stateHash();
    });

    test('should subscribe to StateChanged event', async () => {
      unwatch = mirror.watchStateChangedEvent((stateHash) => {
        newStateHash = stateHash;
      });
    });

    test('should send increment message', async () => {
      const payload = '0x1c436f756e74657224496e6372656d656e74';

      const tx = api.sendInjectedTransaction(
        new InjectedTransaction({
          destination: programId,
          payload,
        }),
      );

      const result = await tx.send();

      expect(result).toBe('Accept');
    });

    test('should wait for a new state hash', async () => {
      while (!newStateHash) {
        await waitNBlocks(1);
      }

      expect(newStateHash).toBeDefined();
      expect(newStateHash).not.toEqual(currentStateHash);
    });

    test('should unsubscribe from StateChanged event', () => {
      unwatch();
    });

    test.todo('listen to reply on the mirror contract');
  });
});
