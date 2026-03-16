import type { Hex, PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';

import { MirrorClient, VaraEthApi, WsVaraEthProvider, createVaraEthApi, getMirrorClient } from '../src';
import { walletClientToSigner } from '../src/signer/index.js';
import { expectDispatch, expectHex, expectMaybeHash, expectNumeric, hasProps } from './common';
import { config } from './config';

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

describe('Program Queries', () => {
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
          expectHex(hash);
        }

        expect(messageIds).toHaveLength(10);
        for (const id of messageIds) {
          expectHex(id);
        }
      },
      config.longRunningTestTimeout,
    );

    test('should unsubscribe from StateChanged event', () => {
      unwatch();
    });
  });

  describe('query methods', () => {
    test('should return array of program IDs including created program', async () => {
      const ids = await api.query.program.getIds();

      expect(Array.isArray(ids)).toBe(true);
      for (const id of ids) expectHex(id);
      expect(ids).toContain(programId);
    });

    test('should return hex code ID matching uploaded code', async () => {
      const codeId = await api.query.program.codeId(programId);

      expectHex(codeId);
      expect(codeId).toBe(config.codeId);
    });

    test('should return program state with MaybeHash fields', async () => {
      const state = await api.query.program.readState(stateHashes[0]);

      expect(typeof state.program).toBe('object');
      expectMaybeHash(state.queueHash);
      expectMaybeHash(state.waitlistHash);
      expectMaybeHash(state.stashHash);
      expectMaybeHash(state.mailboxHash);
      expectNumeric(state.balance);
      expectNumeric(state.executableBalance);
    });

    test('should return full program state with correct field types', async () => {
      const state = await api.query.program.readFullState(stateHashes[0]);

      expect(typeof state.program).toBe('object');
      const programVariants = ['Active', 'Exited', 'Terminated'];
      expect(programVariants.find((v) => v in state.program)).toBeDefined();

      if ('Active' in state.program) {
        const { Active } = state.program;
        expectMaybeHash(Active.allocationsHash);
        expectMaybeHash(Active.pagesHash);
        expect(typeof Active.memoryInfix).toBe('number');
        expect(typeof Active.initialized).toBe('boolean');
      }

      expect(state.canonicalQueue === null || Array.isArray(state.canonicalQueue)).toBe(true);
      expect(state.injectedQueue === null || Array.isArray(state.injectedQueue)).toBe(true);

      if (state.canonicalQueue !== null) {
        for (const d of state.canonicalQueue) expectDispatch(d);
      }
      if (state.injectedQueue !== null) {
        for (const d of state.injectedQueue) expectDispatch(d);
      }

      expect(state.waitlist === null || typeof state.waitlist === 'object').toBe(true);
      expect(state.stash === null || typeof state.stash === 'object').toBe(true);
      expect(state.mailbox === null || typeof state.mailbox === 'object').toBe(true);

      if (state.waitlist !== null) {
        expect(typeof state.waitlist.changed).toBe('boolean');
        for (const entry of Object.values(state.waitlist.inner)) {
          expect(typeof entry.expiry).toBe('number');
          expectDispatch(entry.value);
        }
      }

      if (state.stash !== null) {
        for (const entry of Object.values(state.stash)) {
          expect(typeof entry.expiry).toBe('number');
          expect(Array.isArray(entry.value)).toBe(true);
          expectDispatch(entry.value[0]);
          expect(entry.value[1] === null || typeof entry.value[1] === 'string').toBe(true);
        }
      }

      if (state.mailbox !== null) {
        expect(typeof state.mailbox.changed).toBe('boolean');
        for (const hash of Object.values(state.mailbox.inner)) {
          expectHex(hash);
        }
      }

      expectNumeric(state.balance);
      expectNumeric(state.executableBalance);
    });

    test('should return message queue as array of dispatches', async () => {
      const state = await api.query.program.readState(stateHashes[0]);

      if (!state.queueHash) return;

      const queue = await api.query.program.readQueue(state.queueHash);

      expect(Array.isArray(queue)).toBe(true);
      for (const d of queue) expectDispatch(d);
    });

    test('should return waitlist as record of expiring dispatches', async () => {
      const state = await api.query.program.readState(stateHashes[0]);

      if (!state.waitlistHash) return;

      const waitlist = await api.query.program.readWaitlist(state.waitlistHash);

      expect(typeof waitlist).toBe('object');
      expect(typeof waitlist.changed).toBe('boolean');
      for (const entry of Object.values(waitlist.inner)) {
        expect(typeof entry.expiry).toBe('number');
        expectDispatch(entry.value);
      }
    });

    test('should return stash as record of expiring dispatch tuples', async () => {
      const state = await api.query.program.readState(stateHashes[0]);

      if (!state.stashHash) return;

      const stash = await api.query.program.readStash(state.stashHash);

      expect(typeof stash).toBe('object');
      for (const entry of Object.values(stash)) {
        expect(typeof entry.expiry).toBe('number');
        expect(Array.isArray(entry.value)).toBe(true);
        expectDispatch(entry.value[0]);
        expect(entry.value[1] === null || typeof entry.value[1] === 'string').toBe(true);
      }
    });

    test('should return mailbox as record of hex hashes', async () => {
      const state = await api.query.program.readState(stateHashes[0]);

      if (!state.mailboxHash) return;

      const mailbox = await api.query.program.readMailbox(state.mailboxHash);

      expect(typeof mailbox).toBe('object');
      expect(typeof mailbox.changed).toBe('boolean');
      for (const hash of Object.values(mailbox.inner)) {
        expectHex(hash);
      }
    });

    test('should return memory pages as array of 16 nullable hashes', async () => {
      const state = await api.query.program.readState(stateHashes[0]);

      expect('Active' in state.program).toBeTruthy();
      if (!('Active' in state.program) || !state.program.Active.pagesHash) return;

      const pages = await api.query.program.readPages(state.program.Active.pagesHash);

      expect(Array.isArray(pages)).toBe(true);
      expect(pages.length).toBe(16);
      for (const page of pages) {
        expect(page === null || typeof page === 'string').toBe(true);
        if (page !== null) expectHex(page);
      }
    });

    test.skip(
      'should return page data as hex string',
      async () => {
        const state = await api.query.program.readState(stateHashes[0]);

        expect('Active' in state.program).toBeTruthy();
        if (!('Active' in state.program) || !state.program.Active.pagesHash) return;

        const pages = await api.query.program.readPages(state.program.Active.pagesHash);
        console.log(pages);
        const pageHash = pages.find((p) => p !== null);

        if (!pageHash) return;

        const data = await api.query.program.readPageData(pageHash);
        console.log(data);
        expectHex(data);
        expect(data.length).toBeGreaterThan(2);
      },
      config.longRunningTestTimeout,
    );
  });
});
