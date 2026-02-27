import type { Hex, PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { MirrorClient, VaraEthApi, WsVaraEthProvider, createVaraEthApi, getMirrorClient } from '../src';
import { walletClientToSigner } from '../src/signer/index.js';
import { hasProps } from './common';
import { config } from './config';
import { anvil } from 'viem/chains';

let api: VaraEthApi;
let publicClient: PublicClient;
let walletClient: WalletClient;
let signer: ReturnType<typeof walletClientToSigner>;

let mirror: MirrorClient;

let programId: `0x${string}`;

const stateHashes: Hex[] = [];
const messageIds: Hex[] = [];

beforeAll(async () => {
  const transport = webSocket(config.wsRpc);

  publicClient = createPublicClient({
    transport,
  }) as PublicClient;

  const account = privateKeyToAccount(config.privateKey);

  walletClient = createWalletClient({
    account,
    transport,
    chain: anvil,
  }) as WalletClient;
  signer = walletClientToSigner(walletClient);

  api = await createVaraEthApi(new WsVaraEthProvider(), publicClient, config.routerId, signer);
});

afterAll(async () => {
  await api.provider.disconnect();
});

describe('Program Quries', () => {
  describe('setup', () => {
    test('should create program', async () => {
      const tx = await api.eth.router.createProgram(config.codeId);
      await tx.sendAndWaitForReceipt();

      programId = await tx.getProgramId();
      console.log(`Program id: ${programId}`);

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
      expect(programId).toBeDefined();
      const tx = await api.eth.wvara.approve(programId, BigInt(10 * 1e12));

      await tx.send();

      const approvalData = await tx.getApprovalLog();

      hasProps(approvalData, ['owner', 'spender', 'value']);

      expect(approvalData.value).toEqual(BigInt(10 * 1e12));

      const allowance = await api.eth.wvara.allowance(await signer.getAddress(), programId);
      expect(allowance).toEqual(BigInt(10 * 1e12));
    });

    test('should check that program is active', async () => {
      expect(programId).toBeDefined();
      const hash = await mirror.stateHash();

      const state = await api.query.program.readState(hash);

      expect('Active' in state.program).toBeTruthy();
    });

    test('should top up executable balance', async () => {
      expect(programId).toBeDefined();
      const tx = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));

      const { status } = await tx.sendAndWaitForReceipt();

      expect(status).toBe('success');
    });

    test(
      'should send init message',
      async () => {
        expect(programId).toBeDefined();
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

  describe('send messages', () => {
    let unwatch: () => void;

    // Counter::Increment payload
    const PAYLOAD = '0x1c436f756e74657224496e6372656d656e74';

    test('should subscribe to StateChanged events', () => {
      unwatch = mirror.watchStateChangedEvent((stateHash) => {
        stateHashes.push(stateHash);
      });
    });

    test(
      'should send 5 messages concurrently (mix of injected and mirror)',
      async () => {
        const [injected1, injected2, injected3] = await Promise.all(
          [0, 1, 2].map(() => api.createInjectedTransaction({ destination: programId, payload: PAYLOAD })),
        );
        let startingNonce = await publicClient.getTransactionCount({
          address: await signer.getAddress(),
          blockTag: 'pending',
        });
        const [mirror1, mirror2] = await Promise.all(
          [0, 1].map((i) => mirror.sendMessage(PAYLOAD, 0n, { nonce: startingNonce + i })),
        );

        messageIds.push(injected1.messageId, injected2.messageId, injected3.messageId);

        const [injectedResult1, injectedResult2, injectedResult3] = await Promise.all([
          injected1.sendAndWaitForPromise(),
          injected2.sendAndWaitForPromise(),
          injected3.sendAndWaitForPromise(),
        ]);

        expect(injectedResult1.code.isSuccess).toBeTruthy();
        expect(injectedResult2.code.isSuccess).toBeTruthy();
        expect(injectedResult3.code.isSuccess).toBeTruthy();

        await Promise.all([mirror1.send(), mirror2.send()]);

        const [{ message: message1, waitForReply: waitForReply1 }, { message: message2, waitForReply: waitForReply2 }] =
          await Promise.all([mirror1.setupReplyListener(), mirror2.setupReplyListener()]);

        messageIds.push(message1.id, message2.id);

        const [reply1, reply2] = await Promise.all([waitForReply1(), waitForReply2()]);

        expect(reply1.replyCode).toBe('0x00010000');
        expect(reply2.replyCode).toBe('0x00010000');
      },
      config.longRunningTestTimeout,
    );

    test(
      'should send 5 messages sequentially (alternating injected and mirror)',
      async () => {
        for (let i = 0; i < 5; i++) {
          if (i % 2 === 0) {
            const tx = await api.createInjectedTransaction({ destination: programId, payload: PAYLOAD });
            messageIds.push(tx.messageId);
            const result = await tx.sendAndWaitForPromise();
            expect(result.code.isSuccess).toBeTruthy();
          } else {
            const tx = await mirror.sendMessage(PAYLOAD);
            await tx.send();
            const { message, waitForReply } = await tx.setupReplyListener();
            messageIds.push(message.id);
            const reply = await waitForReply();
            expect(reply.replyCode).toBe('0x00010000');
          }
        }
      },
      config.longRunningTestTimeout,
    );

    test(
      'should have collected state hashes from all sent messages',
      async () => {
        // Concurrent messages may be processed in a single block producing one state hash,
        // so we only guarantee at least 1 hash was emitted per sequential message (5).
        const deadline = Date.now() + config.longRunningTestTimeout;
        while (stateHashes.length < 5 && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, config.blockTime * 1_000));
        }

        expect(stateHashes.length).toBeGreaterThanOrEqual(5);
        for (const hash of stateHashes) {
          expect(typeof hash).toBe('string');
          expect(hash.startsWith('0x')).toBe(true);
        }

        expect(messageIds).toHaveLength(10);
        for (const id of messageIds) {
          expect(typeof id).toBe('string');
          expect(id.startsWith('0x')).toBe(true);
        }
      },
      config.longRunningTestTimeout,
    );

    test('should unsubscribe from StateChanged event', () => {
      console.log(stateHashes);
      unwatch();
    });
  });

  describe('read full state', () => {
    test('read full state (1st hash)', async () => {
      const state = await api.query.program.readFullState(stateHashes[0]);

      console.log(state);
    });
    test('read full state (2nd hash)', async () => {
      const state = await api.query.program.readFullState(stateHashes[1]);

      console.log(state);
    });

    test('read full state (3rd hash)', async () => {
      const state = await api.query.program.readFullState(stateHashes[2]);

      console.log(state);
    });

    test('read full state (4th hash)', async () => {
      const state = await api.query.program.readFullState(stateHashes[3]);

      console.log(state);
    });

    test('read full state (5th hash)', async () => {
      const state = await api.query.program.readFullState(stateHashes[4]);

      console.log(state);
    });

    test('read full state (6th hash)', async () => {
      const state = await api.query.program.readFullState(stateHashes[5]);

      console.log(state);
    });
  });
});
