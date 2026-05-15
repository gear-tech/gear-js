import type { Address, Hex, TransactionReceipt } from 'viem';

import type { EthereumClient } from '../../eth/index.js';

/**
 * Options for {@link deployProgram}.
 *
 * The lib stays adapter-shaped: the EthereumClient must already have a signer
 * attached (set via the factory or {@link EthereumClient.setSigner}). This helper
 * does NOT take a signer override to avoid mutating EthereumClient state mid-call.
 */
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

/**
 * Result of {@link deployProgram}.
 */
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

const DEFAULT_PERMIT_WINDOW_SECONDS = 300n; // 5 minutes

/**
 * One-call helper that uploads a WASM, waits for validator approval, and
 * deploys a program from it. Replaces the multi-step ceremony of:
 *
 * 1. Quote `requestCodeValidationBaseFee + requestCodeValidationExtraFee`
 * 2. Sign a WVARA EIP-2612 permit for that fee
 * 3. Call `router.requestCodeValidation(code, deadline, permitSig)`
 * 4. Wait for the `CodeGotValidated` event
 * 5. (Optionally) sign a second WVARA permit for executable balance
 * 6. Configure and build `createProgramBuilder(codeId)`
 * 7. Wait for the `ProgramCreated` event
 *
 * @param ethClient - The EthereumClient to use for contract calls
 * @param code - WASM bytecode to upload
 * @param options - {@link DeployProgramOptions}
 * @returns {@link DeployProgramResult} after both transactions have been mined and
 *   the validator has approved the code.
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

  // --- Step 1: quote + sign WVARA permit for the code-validation fee
  const [baseFee, extraFee] = await Promise.all([
    router.requestCodeValidationBaseFee(),
    router.requestCodeValidationExtraFee(),
  ]);
  const codeFee = baseFee + extraFee;

  const { signature: codePermitSig } = await wvara.prepareAndSignPermitData(
    router.address,
    codeFee,
    deadline,
  );

  // --- Step 2: requestCodeValidation + wait for CodeGotValidated
  const codeTx = await router.requestCodeValidation(code, deadline, codePermitSig);
  const codeValidationReceipt = await codeTx.sendAndWaitForReceipt();
  await codeTx.waitForCodeGotValidated();
  const { codeId } = codeTx;

  // --- Step 3: (optional) sign executable-balance permit
  let executableBalancePermit:
    | { amount: bigint; deadline: bigint; signature: Hex }
    | undefined;
  if (options.executableBalance !== undefined && options.executableBalance > 0n) {
    const { signature } = await wvara.prepareAndSignPermitData(
      router.address,
      options.executableBalance,
      deadline,
    );
    executableBalancePermit = {
      amount: options.executableBalance,
      deadline,
      signature,
    };
  }

  // --- Step 4: build + send createProgram* tx
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
