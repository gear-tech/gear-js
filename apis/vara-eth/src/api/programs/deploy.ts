import type { Address, Hex, TransactionReceipt } from 'viem';

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
   * EIP-2612 permit deadline override (Unix seconds). Defaults to `now + 5 min`.
   * Applied to both the code-validation fee permit and (if used) the executable
   * balance permit.
   */
  permitDeadline?: bigint;
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

  const now = BigInt(Math.floor(Date.now() / 1000));
  const deadline = options.permitDeadline ?? now + DEFAULT_PERMIT_WINDOW_SECONDS;

  const signPermit = (amount: bigint) => wvara.prepareAndSignPermitData(router.address, amount, deadline);

  const [baseFee, extraFee] = await Promise.all([
    router.requestCodeValidationBaseFee(),
    router.requestCodeValidationExtraFee(),
  ]);
  const codeFee = baseFee + extraFee;

  const { signature: codePermitSig } = await signPermit(codeFee);

  const codeTx = await router.requestCodeValidation(code, deadline, codePermitSig);
  const codeValidationReceipt = await codeTx.sendAndWaitForReceipt();

  // Overlap the executable-balance permit signing with the validator's
  // CodeGotValidated wait — both are independent and the wait dominates.
  const executableBalanceAmount = options.executableBalance ?? 0n;
  const [executableBalancePermit] = await Promise.all([
    executableBalanceAmount > 0n
      ? signPermit(executableBalanceAmount).then(({ signature }) => ({
          amount: executableBalanceAmount,
          deadline,
          signature,
        }))
      : Promise.resolve(undefined),
    codeTx.waitForCodeGotValidated(),
  ]);

  const { codeId } = codeTx;

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
