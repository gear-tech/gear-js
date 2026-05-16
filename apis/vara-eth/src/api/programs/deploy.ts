import type { Address, Hex, TransactionReceipt } from 'viem';

import { CodeValidationTimeoutError } from '../../errors/vara-eth-error.js';
import type { EthereumClient } from '../../eth/index.js';

export interface DeployProgramOptions {
  /** Deterministic salt for the Mirror address. Random 32-byte hex if omitted. */
  salt?: Hex;
  /** Overrides the on-chain initializer (msg.sender by default). */
  overrideInitializer?: Address;
  /**
   * Solidity ABI interface contract address. When provided, the Mirror is
   * deployed in "non-small" form so Etherscan can decode calls.
   */
  abiInterface?: Address;
  /**
   * Initial WVARA executable balance to fund the Mirror with on deployment.
   * Requires a WVARA EIP-2612 permit signed by the signer; this helper signs
   * it automatically using the executable balance amount + a derived deadline.
   */
  executableBalance?: bigint;
  /**
   * EIP-2612 permit deadline override (Unix seconds) for the code-validation
   * fee permit. Defaults to `now + 5 min` at the start of the ceremony.
   *
   * The executable-balance permit (if used) is signed AFTER `CodeGotValidated`
   * resolves with a fresh `now`-based deadline — sharing a single deadline
   * across both permits would cause `createProgramWithExecutableBalance` to
   * revert when the validator wait exceeds 5 minutes.
   */
  permitDeadline?: bigint;
  /**
   * How long to wait for `CodeGotValidated` after the code-validation tx
   * commits. Defaults to 120s. On timeout, throws {@link CodeValidationTimeoutError}
   * carrying `codeId` + `txHash` so callers can resume the deploy by calling
   * `router.createProgramBuilder(codeId).build()` once validators commit
   * out-of-band.
   */
  codeValidationTimeoutMs?: number;
}

export interface DeployProgramResult {
  /** blake2b-256 of the WASM bytecode. */
  codeId: Hex;
  /** Address of the newly created Mirror contract. */
  programAddress: Address;
  /** Ethereum receipt for the `requestCodeValidation` transaction. */
  codeValidationReceipt: TransactionReceipt;
  /** Ethereum receipt for the `createProgram*` transaction. */
  deploymentReceipt: TransactionReceipt;
}

const DEFAULT_PERMIT_WINDOW_SECONDS = 300n;
const DEFAULT_CODE_VALIDATION_TIMEOUT_MS = 120_000;

/**
 * One-call helper that uploads a WASM, waits for validator approval, and
 * deploys a program from it. Replaces the multi-step ceremony of:
 *
 *   quote fee → sign WVARA permit → requestCodeValidation → wait for
 *   CodeGotValidated → (optional) sign executable-balance permit → build →
 *   wait for ProgramCreated.
 *
 * The optional executable-balance permit is signed in parallel with the
 * CodeGotValidated wait, hiding the local-signing round-trip behind chain
 * latency.
 *
 * The EthereumClient must already have a signer attached (set via the factory
 * or {@link EthereumClient.setSigner}). This helper does NOT take a signer
 * override to avoid mutating EthereumClient state mid-call.
 */
export async function deployProgram(
  ethClient: EthereumClient,
  code: Uint8Array,
  options: DeployProgramOptions = {},
): Promise<DeployProgramResult> {
  const router = ethClient.router;
  const wvara = ethClient.wvara;

  const codeFeeDeadline =
    options.permitDeadline ?? BigInt(Math.floor(Date.now() / 1000)) + DEFAULT_PERMIT_WINDOW_SECONDS;
  const timeoutMs = options.codeValidationTimeoutMs ?? DEFAULT_CODE_VALIDATION_TIMEOUT_MS;

  const [baseFee, extraFee] = await Promise.all([
    router.requestCodeValidationBaseFee(),
    router.requestCodeValidationExtraFee(),
  ]);
  const codeFee = baseFee + extraFee;

  const { signature: codePermitSig } = await wvara.prepareAndSignPermitData(
    router.address,
    codeFee,
    codeFeeDeadline,
  );

  const codeTx = await router.requestCodeValidation(code, codeFeeDeadline, codePermitSig);
  const codeValidationReceipt = await codeTx.sendAndWaitForReceipt();
  const { codeId } = codeTx;

  // Bounded wait on `CodeGotValidated`. On timeout the caller is left holding
  // an on-chain code-validation tx; the typed error carries `codeId` + `txHash`
  // so they can resume by calling `router.createProgramBuilder(codeId).build()`
  // once validators commit out-of-band.
  await waitForCodeValidationWithTimeout(
    codeTx.waitForCodeGotValidated(),
    timeoutMs,
    codeId,
    codeValidationReceipt.transactionHash,
  );

  // Sign the executable-balance permit AFTER the validator wait resolves, with
  // a fresh `now`-based deadline. Signing it earlier (in parallel with the
  // wait) shares one deadline across both permits and causes
  // `createProgramWithExecutableBalance` to revert when the wait exceeds 5 min.
  const executableBalanceAmount = options.executableBalance ?? 0n;
  let executableBalancePermit: { amount: bigint; deadline: bigint; signature: Hex } | undefined;
  if (executableBalanceAmount > 0n) {
    const execDeadline =
      options.permitDeadline ?? BigInt(Math.floor(Date.now() / 1000)) + DEFAULT_PERMIT_WINDOW_SECONDS;
    const { signature } = await wvara.prepareAndSignPermitData(
      router.address,
      executableBalanceAmount,
      execDeadline,
    );
    executableBalancePermit = {
      amount: executableBalanceAmount,
      deadline: execDeadline,
      signature,
    };
  }

  let builder = router.createProgramBuilder(codeId);
  if (options.salt) builder = builder.withSalt(options.salt);
  if (options.overrideInitializer) builder = builder.withOverrideInitializer(options.overrideInitializer);
  if (options.abiInterface) builder = builder.withAbiInterface(options.abiInterface);
  if (executableBalancePermit) {
    builder = builder.withExecutableBalance(
      executableBalancePermit.amount,
      executableBalancePermit.deadline,
      executableBalancePermit.signature,
    );
  }

  const deployTx = builder.build();
  const deploymentReceipt = await deployTx.sendAndWaitForReceipt();
  const programAddress = (await deployTx.getProgramId()) as Address;

  return {
    codeId,
    programAddress,
    codeValidationReceipt,
    deploymentReceipt,
  };
}

/**
 * Races the `CodeGotValidated` promise against a timeout, throwing
 * {@link CodeValidationTimeoutError} on expiry. Built on `Promise.race` so the
 * underlying viem `watchContractEvent` subscription keeps running until the
 * surrounding scope tears it down.
 *
 * Exported for unit testing only — public callers should not depend on this.
 * @internal
 */
export async function _waitForCodeValidationWithTimeoutForTests(
  waiter: Promise<boolean>,
  timeoutMs: number,
  codeId: Hex,
  txHash: Hex,
): Promise<void> {
  return waitForCodeValidationWithTimeout(waiter, timeoutMs, codeId, txHash);
}

async function waitForCodeValidationWithTimeout(
  waiter: Promise<boolean>,
  timeoutMs: number,
  codeId: Hex,
  txHash: Hex,
): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new CodeValidationTimeoutError(codeId, txHash, timeoutMs));
      }, timeoutMs);
    });
    await Promise.race([waiter, timeoutPromise]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
