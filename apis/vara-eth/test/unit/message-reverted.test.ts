/**
 * Fence test for MessageRevertedError (PR-B1).
 *
 * Stubs `PublicClient.simulateContract` to throw a viem-shaped revert error
 * carrying decoded `details` (the format `decodeContractError` parses). The
 * MirrorClient's send path must catch it and re-throw `MessageRevertedError`
 * with the decoded `ErrorName(args)` reason and a `functionName` discriminator.
 *
 * Before this fix, the raw `ContractFunctionRevertedError` from viem fell
 * through to callers and the wallet's error formatter could only produce
 * generic `INTERNAL_ERROR` (see vara-wallet docs/vara-eth-followups.md #8).
 */

import { BaseError } from 'viem';
import { MessageRevertedError, VaraEthErrorCode } from '../../src/errors/vara-eth-error.js';
import { MirrorClient } from '../../src/eth/contracts/mirror.contract.js';
import type { ITransactionSigner } from '../../src/types/signer.js';

class FakeRevertError extends BaseError {
  constructor(public override readonly details: string) {
    super('reverted', { details });
  }
}

function makeMirror(simulateThrows: () => never): MirrorClient {
  const publicClient = {
    simulateContract: async () => simulateThrows(),
  } as unknown as MirrorClient['_pc'];
  const signer: ITransactionSigner = {
    getAddress: async () => '0x0000000000000000000000000000000000000001',
    sendTransaction: async () => '0x' as `0x${string}`,
    signMessage: async () => '0x' as `0x${string}`,
    signTypedData: async () => '0x' as `0x${string}`,
  };
  return new MirrorClient({
    address: '0x0000000000000000000000000000000000000002',
    publicClient,
    signer,
  });
}

describe('MirrorClient surfaces MessageRevertedError', () => {
  it('sendMessage rethrows decoded revert as MessageRevertedError', async () => {
    // 0x06b51a0b is the selector for `InitMessageNotCreatedAndCallerNotInitializer()`
    // on the Mirror ABI. viem renders custom errors in details as
    // `custom error <selector>: <data>`; decodeContractError parses this.
    const mirror = makeMirror(() => {
      throw new FakeRevertError('custom error 0x06b51a0b: ');
    });
    await expect(mirror.sendMessage('0xfeed', 0n)).rejects.toMatchObject({
      name: 'MessageRevertedError',
      code: VaraEthErrorCode.MessageReverted,
      functionName: 'sendMessage',
    });
  });

  it('sendMessage preserves the original cause', async () => {
    const cause = new FakeRevertError('custom error 0x06b51a0b: ');
    const mirror = makeMirror(() => {
      throw cause;
    });
    try {
      await mirror.sendMessage('0xfeed', 0n);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(MessageRevertedError);
      expect((err as MessageRevertedError).cause).toBe(cause);
    }
  });

  it('sendReply rethrows decoded revert as MessageRevertedError', async () => {
    const mirror = makeMirror(() => {
      throw new FakeRevertError('custom error 0x06b51a0b: ');
    });
    await expect(mirror.sendReply(`0x${'00'.repeat(32)}`, '0xbeef', 0n)).rejects.toMatchObject({
      name: 'MessageRevertedError',
      functionName: 'sendReply',
    });
  });

  it('falls through with a generic reason when the selector is unknown', async () => {
    const mirror = makeMirror(() => {
      throw new FakeRevertError('something else entirely');
    });
    try {
      await mirror.sendMessage('0xfeed', 0n);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(MessageRevertedError);
      expect((err as MessageRevertedError).reason).toContain('something else entirely');
    }
  });
});
