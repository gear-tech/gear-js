import { createPublicClient, createWalletClient, webSocket, zeroAddress } from 'viem';
import type { Account, Chain, Hex, PublicClient, WalletClient, WebSocketTransport } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { execSync } from 'node:child_process';

import { EthereumClient, VaraEthApi, getMirrorClient, WsVaraEthProvider, Injected, IInjectedTransaction } from '../src';
import { hasProps, waitNBlocks } from './common';
import { config } from './config';

let api: VaraEthApi;
let publicClient: PublicClient<WebSocketTransport, Chain, undefined>;
let walletClient: WalletClient<WebSocketTransport, Chain, Account>;
let ethereumClient: EthereumClient;

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
  ethereumClient = new EthereumClient(publicClient, walletClient, config.routerId);

  api = new VaraEthApi(new WsVaraEthProvider(), ethereumClient);
});

afterAll(async () => {
  await api.provider.disconnect();
});

describe('Injected Transactions', () => {
  describe('signature', () => {
    let injectedTxHash: string;
    let injectedTxSignature: string;
    let injectedMessageId: string;

    const INJECTED_TEST_PROGRAM_MANIFEST_PATH = 'programs/injected/Cargo.toml';

    const TX: IInjectedTransaction = {
      recipient: '0x0000000000000000000000000000000000000000',
      destination: '0x0000000000000000000000000000000000000000',
      payload: '0x000102',
      value: 256n,
      referenceBlock: '0x0000000000000000000000000000000000000000000000000000000000000000',
      salt: '0x030405',
    };

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
      const injected = new Injected(api.provider, ethereumClient, TX);
      expect(injected.hash).toBe(injectedTxHash);
    });

    test('should create a correct message id', () => {
      const injected = new Injected(api.provider, ethereumClient, TX);
      expect(injected.messageId).toBe(injectedMessageId);
    });

    test('should create a correct signature', async () => {
      const account = privateKeyToAccount(PRIVATE_KEY);

      const injected = new Injected(api.provider, ethereumClient, TX);

      const signature = await account.sign({ hash: injected.hash });

      expect(signature).toBe(injectedTxSignature);
    });
  });

  describe('setup', () => {
    test('should create program', async () => {
      const tx = await ethereumClient.router.createProgram(config.codeId);
      await tx.sendAndWaitForReceipt();

      programId = await tx.getProgramId();
      console.log(`Program id: ${programId}`);

      expect(programId).toBeDefined();

      mirror = getMirrorClient(programId, walletClient, publicClient);
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
      const tx = await ethereumClient.wvara.approve(programId, BigInt(10 * 1e12));

      await tx.send();

      const approvalData = await tx.getApprovalLog();

      hasProps(approvalData, ['owner', 'spender', 'value']);

      expect(approvalData.value).toEqual(BigInt(10 * 1e12));

      const allowance = await ethereumClient.wvara.allowance(ethereumClient.accountAddress, programId);
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

        await waitForReply();
      },
      config.longRunningTestTimeout,
    );
  });

  describe('transactions', () => {
    let unwatch: () => void;

    let currentStateHash: Hex;
    let newStateHash: Hex;

    let messageId: Hex;

    let testTx: Injected;

    test('should set recipient to null by default', async () => {
      testTx = await api.createInjectedTransaction({
        destination: programId,
        payload: '0x',
      });

      expect(testTx.recipient).toBeNull();
    });

    test('should set specific recipient address using setRecipient', async () => {
      const recipient = await testTx.setRecipient('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');

      expect(recipient).toBe('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');
      expect(testTx.recipient).toBe('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');
    });

    test('should set zero address as default in setRecipient', async () => {
      const recipient = await testTx.setRecipient();

      expect(recipient).toBe(zeroAddress);
      expect(testTx.recipient).toBe(zeroAddress);
    });

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

      const injected: IInjectedTransaction = {
        destination: programId,
        payload,
      };
      const tx = await api.createInjectedTransaction(injected);

      expect(tx.recipient).toBeNull();

      const result = await tx.send();

      expect(tx.recipient).toBe(zeroAddress);

      messageId = tx.messageId;

      expect(result).toBe('Accept');
    });

    test(
      'should wait for reply on Etherum',
      async () => {
        const reply = await mirror.waitForReply(messageId);

        expect(reply).toHaveProperty('payload', '0x1c436f756e74657224496e6372656d656e7401000000');
        expect(reply).toHaveProperty('value', 0n);
        expect(reply).toHaveProperty('replyCode', '0x00010000');
        expect(reply).toHaveProperty('blockNumber');
        expect(reply).toHaveProperty('txHash');
      },
      config.longRunningTestTimeout,
    );

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

    test('should send a message and wait for the promise', async () => {
      const payload = '0x1c436f756e74657224496e6372656d656e74';

      const injected: IInjectedTransaction = {
        destination: programId,
        payload,
      };

      const tx = await api.createInjectedTransaction(injected);

      const result = await tx.sendAndWaitForPromise();

      expect(result).toHaveProperty('txHash');
      expect(result).toHaveProperty(['reply', 'code'], '0x00010000');
      expect(result).toHaveProperty(['reply', 'payload'], '0x1c436f756e74657224496e6372656d656e7402000000');
      expect(result).toHaveProperty(['reply', 'value'], 0);
      expect(result).toHaveProperty('signature');
    });
  });
});
