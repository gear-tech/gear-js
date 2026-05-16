import type { Address, Hex } from 'viem';

import type { EthereumClient } from '../../eth/index.js';
import { getMirrorClient } from '../../eth/index.js';
import { ReplyCode } from '../../errors/index.js';
import { PromiseSignatureInvalidError, PromiseTimeoutError } from '../../errors/vara-eth-error.js';
import { withTimeout } from '../../util/promise.js';
import type { CreateInjectedTransaction } from './index.js';

/**
 * Path selector for {@link sendAndWaitForReply}.
 *
 * - `'eth'` (default): submit via Mirror.sendMessage on Ethereum L1. Caller pays ETH gas;
 *   reply is awaited via the on-chain Reply event listener.
 * - `'injected'`: submit via the ethexe-rpc `injected_sendTransactionAndWatch`.
 *   Caller pays no ETH gas (signer just signs); reply is awaited via the validator's
 *   signed promise envelope.
 */
export type SendPath = 'eth' | 'injected';

export interface SendAndWaitOptions {
  /** Which transport to use. Defaults to `'eth'` since it doesn't require validator routing. */
  via?: SendPath;
  /** Value in wei (ETH path) or wei (injected — currently unused but part of the preimage). */
  value?: bigint;
  /** Override the timeout for awaiting the reply. */
  timeoutMs?: number;
  /** For `via: 'injected'`: explicit reference block hash (defaults to recent head − 3). */
  referenceBlock?: Hex;
  /** For `via: 'injected'`: explicit salt (defaults to random 32 bytes). */
  salt?: Hex;
  /** For `via: 'injected'`: explicit validator recipient (defaults to broadcast / zero address). */
  recipient?: Address;
  /**
   * For `via: 'injected'`: validate the validator's signature on the promise reply.
   * Defaults to `true`. Set to `false` only for diagnostics — turning this off in
   * production means accepting any validator's claim of having executed the tx.
   */
  validateSignature?: boolean;
}

/**
 * Shape of a resolved reply for either path.
 */
export interface ReplyResult {
  messageId: Hex;
  reply: {
    payload: Hex;
    value: bigint;
    code: ReplyCode;
  };
  /** Tx hash on Ethereum (eth path) or injected txHash (injected path). */
  txHash: Hex;
  /** Validator that signed the promise (injected path only). */
  validator?: Address;
}

const DEFAULT_INJECTED_TIMEOUT_MS = 240_000; // slot_duration * 20 @ 12s slots
const DEFAULT_ETH_TIMEOUT_MS = 120_000;

/**
 * One-call helper: submit a message to a program and wait for its reply.
 * Supports both the on-chain Mirror.sendMessage path and the off-chain
 * injected-tx path. The choice belongs to the caller via {@link SendAndWaitOptions.via}.
 */
export async function sendAndWaitForReply(
  createInjectedTransaction: CreateInjectedTransaction,
  ethClient: EthereumClient,
  mirror: Address,
  payload: Hex,
  options: SendAndWaitOptions = {},
): Promise<ReplyResult> {
  const path: SendPath = options.via ?? 'eth';

  if (path === 'eth') {
    return sendViaEth(ethClient, mirror, payload, options);
  }
  return sendViaInjected(createInjectedTransaction, mirror, payload, options);
}

async function sendViaEth(
  ethClient: EthereumClient,
  mirror: Address,
  payload: Hex,
  options: SendAndWaitOptions,
): Promise<ReplyResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_ETH_TIMEOUT_MS;

  const mirrorClient = getMirrorClient({
    publicClient: ethClient.publicClient,
    address: mirror,
    signer: ethClient.signer,
  });

  const tx = await mirrorClient.sendMessage(payload, options.value);
  // `setupReplyListener` calls `getReceipt` internally, which throws if the tx
  // hasn't been broadcast yet. Submit explicitly before wiring the listener.
  await tx.send();
  const { txHash, message, waitForReply } = await tx.setupReplyListener();
  const txHashHex = txHash as Hex;

  const reply = await withTimeout(
    waitForReply(),
    timeoutMs,
    () => new PromiseTimeoutError(txHashHex, timeoutMs),
  );

  return {
    messageId: message.id as Hex,
    reply: {
      payload: reply.payload,
      value: reply.value,
      code: ReplyCode.fromBytes(reply.replyCode as Hex),
    },
    txHash: txHashHex,
  };
}

async function sendViaInjected(
  createInjectedTransaction: CreateInjectedTransaction,
  mirror: Address,
  payload: Hex,
  options: SendAndWaitOptions,
): Promise<ReplyResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_INJECTED_TIMEOUT_MS;
  const validate = options.validateSignature ?? true;

  const injectedTx = await createInjectedTransaction({
    destination: mirror,
    payload,
    value: options.value ?? 0n,
    referenceBlock: options.referenceBlock,
    salt: options.salt,
    recipient: options.recipient,
  });

  const promise = await withTimeout(
    injectedTx.sendAndWaitForPromise(),
    timeoutMs,
    () => new PromiseTimeoutError(injectedTx.messageId, timeoutMs),
  );

  if (validate) {
    try {
      await promise.validateSignature();
    } catch (cause) {
      throw new PromiseSignatureInvalidError(undefined, cause);
    }
  }

  return {
    messageId: injectedTx.messageId,
    reply: {
      payload: promise.payload,
      value: promise.value,
      code: promise.code,
    },
    txHash: promise.txHash,
    validator: validate ? promise.validatorAddress : undefined,
  };
}

