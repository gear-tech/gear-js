import type { Address, Hex, TransactionReceipt } from 'viem';

import { CodeValidationTimeoutError } from '../../errors/vara-eth-error.js';
import type { EthereumClient } from '../../eth/index.js';
import { withTimeout } from '../../util/promise.js';

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
   * EIP-2612 permit deadline override (Unix seconds) used for BOTH the
   * code-validation fee permit and (if `executableBalance > 0`) the
   * executable-balance permit. Each permit is signed independently — the
   * code-fee permit at the start of the ceremony, the executable-balance
   * permit AFTER `CodeGotValidated` resolves — and each defaults to
   * `now + 5 min` if this override is omitted. Sharing one ABSOLUTE deadline
   * across both is only safe when the validator wait is short enough that
   * the executable-balance permit hasn't expired by the time `build()` runs.
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

  // `requestCodeValidation` (direct) charges only `baseFee`. The
  // `requestCodeValidationOnBehalf` variant is the one that adds `extraFee`,
  // and this helper doesn't use it. Over-permitting would leak an unused
  // allowance to the router. See ethexe/contracts/src/Router.sol → the direct
  // function transfers `baseFee` only; the on-behalf function transfers
  // `baseFee + extraFee`.
  const codeFee = await router.requestCodeValidationBaseFee();

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
  await withTimeout(
    codeTx.waitForCodeGotValidated(),
    timeoutMs,
    () => new CodeValidationTimeoutError(codeId, codeValidationReceipt.transactionHash, timeoutMs),
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
