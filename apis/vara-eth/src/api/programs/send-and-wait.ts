import type { Address, Hex } from 'viem';

import type { EthereumClient } from '../../eth/index.js';
import { getMirrorClient } from '../../eth/index.js';
import { ReplyCode } from '../../errors/index.js';
import { PromiseSignatureInvalidError, PromiseTimeoutError } from '../../errors/vara-eth-error.js';
import type { IVaraEthProvider, IVaraEthValidatorPoolProvider } from '../../types/index.js';
import { InjectedTx } from '../injected/tx.js';

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
 *
 * @param provider - JSON-RPC provider for the Vara.Eth node (needed for injected path)
 * @param ethClient - EthereumClient with a signer attached
 * @param mirror - Address of the target program's Mirror contract
 * @param payload - Hex-encoded message payload
 * @param options - See {@link SendAndWaitOptions}
 * @returns {@link ReplyResult} once the reply arrives or rejects on timeout.
 */
export async function sendAndWaitForReply(
  provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
  ethClient: EthereumClient,
  mirror: Address,
  payload: Hex,
  options: SendAndWaitOptions = {},
): Promise<ReplyResult> {
  const path: SendPath = options.via ?? 'eth';

  if (path === 'eth') {
    return sendViaEth(ethClient, mirror, payload, options);
  }
  return sendViaInjected(provider, ethClient, mirror, payload, options);
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
  const { txHash, message, waitForReply } = await tx.setupReplyListener();
  const txHashHex = txHash as Hex;

  const reply = await withTimeout(waitForReply(), timeoutMs, txHashHex);

  return {
    messageId: message.id as Hex,
    reply: {
      payload: reply.payload,
      value: reply.value,
      // Both rails should expose the same parsed ReplyCode object.
      code: ReplyCode.fromBytes(reply.replyCode as Hex),
    },
    txHash: txHashHex,
  };
}

async function sendViaInjected(
  provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
  ethClient: EthereumClient,
  mirror: Address,
  payload: Hex,
  options: SendAndWaitOptions,
): Promise<ReplyResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_INJECTED_TIMEOUT_MS;
  const validate = options.validateSignature ?? true;

  const injectedTx = new InjectedTx(provider, ethClient, {
    destination: mirror,
    payload,
    value: options.value ?? 0n,
    referenceBlock: options.referenceBlock,
    salt: options.salt,
    recipient: options.recipient,
  });

  if (!injectedTx.referenceBlock) {
    await injectedTx.setReferenceBlock();
  }

  const promise = await withTimeout(
    injectedTx.sendAndWaitForPromise(),
    timeoutMs,
    injectedTx.messageId,
  );

  if (validate) {
    try {
      await promise.validateSignature();
    } catch (cause) {
      throw new PromiseSignatureInvalidError(
        (promise as { validatorAddress?: Address }).validatorAddress ?? ('0x0' as Address),
        cause,
      );
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

async function withTimeout<T>(promise: Promise<T>, ms: number, txHash: Hex): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new PromiseTimeoutError(txHash, ms)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
