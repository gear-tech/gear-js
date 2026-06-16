import type { Address, Hex } from 'viem';
import { ReplyCode } from '../../errors/index.js';
import { PromiseSignatureInvalidError, PromiseTimeoutError } from '../../errors/vara-eth-error.js';
import type { EthereumClient } from '../../eth/index.js';
import { getMirrorClient } from '../../eth/index.js';
import { withTimeout } from '../../util/promise.js';
import type { InjectedTxPromise, InjectedTxReceipt } from '../injected/index.js';
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
  /**
   * Value in wei. Honored only on `via: 'eth'`. The injected path REJECTS
   * non-zero value at the ethexe-rpc layer (see relay.rs) — pass any non-zero
   * value with `via: 'injected'` and this helper throws before signing.
   * The field is still part of the preimage on the injected path (signed as 0).
   */
  value?: bigint;
  /** Override the timeout for awaiting the reply. */
  timeoutMs?: number;
  /** For `via: 'injected'`: explicit reference block hash (defaults to recent head − 3). */
  referenceBlock?: Hex;
  /** For `via: 'injected'`: explicit salt (defaults to random 32 bytes). */
  salt?: Hex;
  /**
   * For `via: 'injected'`: explicit validator recipient. Defaults to the zero
   * address, which the ethexe-rpc relay interprets as "auto-route to the
   * next-slot producer" (see `relay.rs::route_transaction` →
   * `calculate_next_producer`). Not gossip-broadcast — the server picks one
   * validator deterministically from the slot calendar.
   */
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

function isInjectedTxReceipt(result: InjectedTxPromise | InjectedTxReceipt): result is InjectedTxReceipt {
  return 'error' in result && 'promise' in result && 'address' in result;
}

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

  const reply = await withTimeout(waitForReply(), timeoutMs, () => new PromiseTimeoutError(txHashHex, timeoutMs));

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

  if ((options.value ?? 0n) !== 0n) {
    // Pre-validate before signing — the ethexe-rpc relay rejects non-zero
    // value with a bad-request error (relay.rs:47-56). Failing client-side
    // gives a clearer call-site signal than an opaque RPC error.
    throw new Error(
      'sendAndWaitForReply: `value` must be 0 on the injected path. Switch to `via: "eth"` to send value.',
    );
  }

  const injectedTx = await createInjectedTransaction({
    destination: mirror,
    payload,
    value: 0n,
    referenceBlock: options.referenceBlock,
    salt: options.salt,
    recipient: options.recipient,
  });

  const result = await withTimeout(
    injectedTx.sendAndWaitForPromise(),
    timeoutMs,
    () => new PromiseTimeoutError(injectedTx.messageId, timeoutMs),
  );

  if (validate) {
    try {
      await result.validateSignature();
    } catch (cause) {
      throw new PromiseSignatureInvalidError(undefined, cause);
    }
  }

  if (isInjectedTxReceipt(result)) {
    if (result.error !== null) {
      throw new Error(`Injected transaction was purged: ${result.error}`);
    }

    return {
      messageId: injectedTx.messageId,
      reply: {
        payload: result.promise.payload,
        value: result.promise.value,
        code: result.promise.code,
      },
      txHash: result.txHash,
      validator: validate ? result.address : undefined,
    };
  }

  return {
    messageId: injectedTx.messageId,
    reply: {
      payload: result.payload,
      value: result.value,
      code: result.code,
    },
    txHash: result.txHash,
    validator: validate ? result.validatorAddress : undefined,
  };
}
