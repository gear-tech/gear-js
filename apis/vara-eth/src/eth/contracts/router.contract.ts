import type { Address, Hash, Hex, Signature } from 'viem';
import { encodeFunctionData } from 'viem/utils';

import {
  blobToKzgCommitment,
  calculateBlobVersionedHashesAndCommitments,
  computeBlobKzgProof,
  computeCellsAndKzgProofs,
  simpleSidecarEncode,
  waitForKzg,
} from '../../util/blob.js';
import { decodeContractError } from '../../util/error.js';
import { generateCodeHash } from '../../util/hash.js';
import { getRVSComponents } from '../../util/signature.js';
import { IROUTER_ABI, type IRouterContract } from '../abi/IRouter.js';
import { IWRAPPEDVARA_ABI } from '../abi/IWrappedVara.js';
import { CodeState, type CodeValidationHelpers } from '../interfaces/router.js';
import type { ITxManager, TxManagerWithHelpers } from '../interfaces/tx-manager.js';
import { TxManager } from '../tx-manager.js';
import type { ContractClientParams } from './base.contract.js';
import { CreateProgramBuilder } from './create-program.builder.js';
import { EIP712ContractClient } from './eip-712.contract.js';
import { waitForCodeGotValidated } from './router.helper.js';

const DEFAULT_MAX_FEE_PER_BLOB_GAS_MULTIPLIER = 3n;

/**
 * Constructor parameters for {@link RouterClient}.
 * Extends the base contract params with router-specific options.
 */
export type RouterContractClientParams = Omit<ContractClientParams, 'abi'> & {
  /**
   * Multiplier applied to the latest `baseFeePerBlobGas` to derive `maxFeePerBlobGas`
   * for EIP-4844 blob transactions. Defaults to `3n`.
   */
  maxFeePerBlobGasMultiplier?: bigint;
};

const getCodeState = (value: number): CodeState => {
  switch (value) {
    case 0: {
      return CodeState.Unknown;
    }
    case 1: {
      return CodeState.ValidationRequested;
    }
    case 2: {
      return CodeState.Validated;
    }
    default: {
      throw new Error('Invalid code state');
    }
  }
};

/**
 * Contract client for the Router contract.
 *
 * The Router is the primary entry point for a co-processor instance. It manages code validation,
 * program creation, batch commitment, and the validator set. It emits two types of events:
 * *informational* events that notify external users of changes, and *requesting* events that
 * instruct validator nodes to perform processing inside the co-processor.
 */
export class RouterClient extends EIP712ContractClient<typeof IROUTER_ABI> implements IRouterContract {
  private _cachedGenesisBlockHash: Hash | undefined;
  private _cachedGenesisTimestamp: number | undefined;
  private _cachedWrappedVara: Address | undefined;
  private readonly _maxFeePerBlobGasMultiplier: bigint;

  constructor(params: RouterContractClientParams) {
    super({ ...params, abi: IROUTER_ABI });
    this._maxFeePerBlobGasMultiplier = params.maxFeePerBlobGasMultiplier ?? DEFAULT_MAX_FEE_PER_BLOB_GAS_MULTIPLIER;
  }

  /** Returns `true` if all provided addresses are current validators. */
  areValidators(validators: Address[]): Promise<boolean> {
    return this.read('areValidators', [validators]);
  }

  /**
   * Returns the validation state for each of the given code IDs.
   * @param codeIds - Array of code IDs (blake2b hashes of WASM bytecode)
   */
  async codesStates(codeIds: Hex[]): Promise<CodeState[]> {
    const states = await this.read('codesStates', [codeIds]);

    return states.map((value) => getCodeState(value));
  }

  /** Returns the current computation settings (gas threshold and WVARA-per-second rate). */
  computeSettings(): Promise<{
    threshold: bigint;
    wvaraPerSecond: bigint;
  }> {
    return this.read('computeSettings');
  }

  /**
   * Returns the hash of the genesis block that identifies this co-processor instance.
   * Result is fetched once and cached for subsequent calls.
   */
  async genesisBlockHash(): Promise<Hash> {
    if (this._cachedGenesisBlockHash === undefined) {
      this._cachedGenesisBlockHash = await this.read('genesisBlockHash');
    }
    return this._cachedGenesisBlockHash;
  }

  /**
   * Returns the timestamp of the genesis block.
   * Result is fetched once and cached for subsequent calls.
   */
  async genesisTimestamp(): Promise<number> {
    if (this._cachedGenesisTimestamp === undefined) {
      this._cachedGenesisTimestamp = await this.read('genesisTimestamp');
    }
    return this._cachedGenesisTimestamp;
  }

  /** Returns `true` if the given address is a current validator. */
  isValidator(validator: Address): Promise<boolean> {
    return this.read('isValidator', [validator]);
  }

  /** Returns the hash of the most recently committed batch. */
  latestCommittedBatchHash(): Promise<Hash> {
    return this.read('latestCommittedBatchHash');
  }

  /** Returns the timestamp of the most recently committed batch. */
  latestCommittedBatchTimestamp(): Promise<number> {
    return this.read('latestCommittedBatchTimestamp');
  }

  /** Returns the address of the `Mirror` implementation contract used for proxy clones. */
  mirrorImpl(): Promise<string> {
    return this.read('mirrorImpl');
  }

  /** Returns the address of the middleware contract. */
  middleware(): Promise<string> {
    return this.read('middleware');
  }

  /** Returns the owner address of the Router contract. */
  owner(): Promise<string> {
    return this.read('owner');
  }

  /** Returns `true` if the Router contract is currently paused. */
  paused(): Promise<boolean> {
    return this.read('paused');
  }

  /** Returns the protocol timeline parameters (era duration, election duration, etc.). */
  timelines(): Promise<{ era: bigint; election: bigint; validationDelay: bigint }> {
    return this.read('timelines');
  }

  /**
   * Returns the code ID of the WASM implementation for the given program address.
   * @param programId - On-chain address of the Mirror (program)
   */
  programCodeId(programId: Address): Promise<string> {
    return this.read('programCodeId', [programId]);
  }

  /**
   * Returns the code IDs for an array of program addresses.
   * @param programsIds - Array of on-chain Mirror (program) addresses
   */
  programsCodeIds(programsIds: Address[]): Promise<readonly Hex[]> {
    return this.read('programsCodeIds', [programsIds]);
  }

  /** Returns the total number of programs created through this Router. */
  programsCount(): Promise<bigint> {
    return this.read('programsCount');
  }

  /**
   * Returns the signing threshold as a fraction `[numerator, denominator]`.
   * A batch commitment is valid when at least `numerator/denominator` of validators sign it.
   */
  signingThresholdFraction(): Promise<readonly [bigint, bigint]> {
    return this.read('signingThresholdFraction');
  }

  /** Returns the total number of WASM codes that have been successfully validated. */
  validatedCodesCount(): Promise<bigint> {
    return this.read('validatedCodesCount');
  }

  /** Returns the list of current validator addresses (lowercased). */
  async validators(): Promise<Address[]> {
    const validators = await this.read('validators');

    return validators.map((addr) => addr.toLowerCase() as Address);
  }

  /** Returns the aggregated FROST public key of the current validator set. */
  async validatorsAggregatedPublicKey(): Promise<{ x: bigint; y: bigint }> {
    return this.read('validatorsAggregatedPublicKey');
  }

  /** Returns the number of validators in the current set. */
  async validatorsCount(): Promise<bigint> {
    return this.read('validatorsCount');
  }

  /** Returns the minimum number of validator signatures required to commit a batch. */
  async validatorsThreshold(): Promise<bigint> {
    return this.read('validatorsThreshold');
  }

  /**
   * Returns the serialised FROST `VerifiableSecretSharingCommitment` for the current validator set.
   * See https://docs.rs/frost-core/latest/frost_core/keys/struct.VerifiableSecretSharingCommitment.html
   */
  validatorsVerifiableSecretSharingCommitment(): Promise<string> {
    return this.read('validatorsVerifiableSecretSharingCommitment');
  }

  /**
   * @returns The address of WrappedVara contract
   */
  async wrappedVara(): Promise<Hex> {
    if (this._cachedWrappedVara === undefined) {
      this._cachedWrappedVara = await this.read('wrappedVara');
    }
    return this._cachedWrappedVara;
  }

  /**
   * Gets the validation state of a code.
   *
   * @param codeId - The ID of the code to check
   * @returns Promise resolving to the code state
   * @throws Error if the code state is invalid
   */
  async codeState(codeId: Hex): Promise<CodeState> {
    const _state = await this.read('codeState', [codeId]);
    return getCodeState(_state);
  }

  /** Returns the base WVARA fee charged for `requestCodeValidation`. */
  requestCodeValidationBaseFee(): Promise<bigint> {
    return this.read('requestCodeValidationBaseFee');
  }

  /** Returns the extra WVARA fee charged on top of the base fee for `requestCodeValidationOnBehalf`. */
  requestCodeValidationExtraFee(): Promise<bigint> {
    return this.read('requestCodeValidationExtraFee');
  }

  /**
   * Returns the EIP-2612 permit nonce for the given owner address.
   * @param owner - Token holder address
   */
  nonces(owner: Address): Promise<bigint> {
    return this.read('nonces', [owner]);
  }

  private async _createRequestCodeValidationTxManager(data: Hex, code: Uint8Array, codeId: Hash) {
    const signer = this._ensureSigner();

    const blobs = simpleSidecarEncode(code);

    const feeHistory = await this._pc.getFeeHistory({
      blockCount: 2,
      rewardPercentiles: [],
      blockTag: 'latest',
    });

    const baseFeePerBlobGas = (feeHistory.baseFeePerBlobGas ?? []).at(-1);
    if (!baseFeePerBlobGas) {
      throw new Error('Failed to get baseFeePerBlobGas');
    }
    const maxFeePerBlobGas = baseFeePerBlobGas * this._maxFeePerBlobGasMultiplier;

    await waitForKzg();
    const { blobVersionedHashes, blobCommitmentsMap } = calculateBlobVersionedHashesAndCommitments(blobs);

    const signerAddress = await signer.getAddress();

    const tx = {
      type: 'eip4844' as const,
      blobVersion: '7594' as const,
      data,
      to: this.address,
      gas: 100_000n,
      maxFeePerBlobGas,
      blobs,
      kzg: {
        blobToKzgCommitment: blobToKzgCommitment(blobCommitmentsMap),
        computeBlobKzgProof,
        computeCellsAndKzgProofs,
      },
      chain: null,
      account: signerAddress,
    };

    try {
      tx.gas = await this._pc.estimateGas(tx);
    } catch (error) {
      throw decodeContractError(error, [this._abi, IWRAPPEDVARA_ABI]);
    }

    await this._pc.prepareTransactionRequest(tx);

    const txManager: ITxManager = new TxManager(
      this._pc,
      signer,
      tx,
      IROUTER_ABI,
      { waitForCodeGotValidated: waitForCodeGotValidated(codeId) },
      { codeId, blobVersionedHashes },
    );

    return txManager as TxManagerWithHelpers<CodeValidationHelpers>;
  }

  /**
   * Requests code validation by submitting the code as a blob in the transaction.
   * Charges `requestCodeValidationBaseFee + requestCodeValidationExtraFee` in WVARA via an
   * EIP-2612 permit, so no prior `approve` call is needed.
   *
   * @param code - The WASM bytecode to be validated
   * @param deadline - Expiry timestamp for the WVARA permit signature
   * @param wvaraPermitSignature - EIP-712 permit signature authorising the fee transfer
   * @returns A transaction manager with validation-specific helper functions, including
   *          the code ID and a function to wait for the code to be validated
   */
  public async requestCodeValidation(
    code: Uint8Array,
    deadline: bigint,
    wvaraPermitSignature: Signature | Hex,
  ): Promise<TxManagerWithHelpers<CodeValidationHelpers>> {
    const codeId = generateCodeHash(code);
    const { v, r, s } = getRVSComponents(wvaraPermitSignature);

    const data = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'requestCodeValidation',
      args: [codeId, deadline, v, r, s],
    });

    return this._createRequestCodeValidationTxManager(data, code, codeId);
  }

  /**
   * Requests code validation on behalf of another address.
   * Charges `requestCodeValidationBaseFee + requestCodeValidationExtraFee` in WVARA.
   * Requires two EIP-712 signatures obtained from the requester via
   * {@link prepareAndSignRequestCodeValidationPermitData} and from the fee payer via
   * {@link WrappedVaraClient.prepareAndSignPermitData}.
   * @param requester - Address on whose behalf the request is made
   * @param code - The WASM bytecode to be validated
   * @param blobHashes - Blob hashes of the EIP-4844/EIP-7594 transaction sidecars
   * @param deadline - Shared expiry timestamp for both signatures
   * @param requestCodeValidationSignature - EIP-712 signature from the requester authorising the validation request
   * @param wvaraPermitSignature - EIP-712 permit signature authorising the WVARA fee transfer
   * @returns A transaction manager with validation-specific helper functions, including
   *          the code ID and a function to wait for the code to be validated
   */
  requestCodeValidationOnBehalf(
    requester: Address,
    code: Uint8Array,
    blobHashes: Hex[],
    deadline: bigint,
    requestCodeValidationSignature: Signature | Hex,
    wvaraPermitSignature: Signature | Hex,
  ): Promise<TxManagerWithHelpers<CodeValidationHelpers>> {
    const codeId = generateCodeHash(code);

    const { v: v1, r: r1, s: s1 } = getRVSComponents(requestCodeValidationSignature);
    const { v: v2, r: r2, s: s2 } = getRVSComponents(wvaraPermitSignature);

    const data = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'requestCodeValidationOnBehalf',
      args: [requester, codeId, blobHashes, deadline, v1, r1, s1, v2, r2, s2],
    });

    return this._createRequestCodeValidationTxManager(data, code, codeId);
  }

  async prepareAndSignRequestCodeValidationPermitData(code: Uint8Array, deadline: bigint) {
    const signer = this._ensureSigner();
    const requester = await signer.getAddress();

    const blobs = simpleSidecarEncode(code);
    const { blobVersionedHashes: blobHashes } = calculateBlobVersionedHashesAndCommitments(blobs);
    const codeId = generateCodeHash(code);

    const [nonce, domain] = await Promise.all([this.nonces(requester), this.eip712Domain()]);

    const types = {
      RequestCodeValidationOnBehalf: [
        { name: 'requester', type: 'address' },
        { name: 'codeId', type: 'bytes32' },
        { name: 'blobHashes', type: 'bytes32[]' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const signature = await signer.signTypedData({
      message: { requester, codeId, blobHashes, nonce, deadline },
      types,
      primaryType: 'RequestCodeValidationOnBehalf',
      domain,
    });

    return { codeId, requester, blobHashes, deadline, signature };
  }

  /**
   * Returns a fluent builder for creating a program from validated code.
   *
   * The builder selects the appropriate on-chain function automatically based on
   * which optional features are configured:
   *
   * | `.withAbiInterface()` | `.withExecutableBalance()` | On-chain function |
   * |---|---|---|
   * | — | — | `createProgram` |
   * | ✓ | — | `createProgramWithAbiInterface` |
   * | — | ✓ | `createProgramWithExecutableBalance` |
   * | ✓ | ✓ | `createProgramWithAbiInterfaceAndExecutableBalance` |
   *
   * @param codeId - The ID of the validated code to instantiate
   * @returns A {@link CreateProgramBuilder} instance
   *
   * @example Basic usage — create a program from validated code:
   * ```typescript
   * const tx = router.createProgramBuilder(codeId).build();
   * await tx.sendAndWaitForReceipt();
   * const programId = await tx.getProgramId();
   * ```
   *
   * @example With an Etherscan-compatible ABI interface:
   * ```typescript
   * const tx = router.createProgramBuilder(codeId)
   *   .withAbiInterface(abiContractAddress)
   *   .build();
   * await tx.sendAndWaitForReceipt();
   * ```
   *
   * @example With an initial WVARA executable balance (no ABI, gas-efficient Mirror):
   * ```typescript
   * const deadline = BigInt(Date.now() + 60_000);
   * const { signature } = await wvara.prepareAndSignPermitData(router.address, amount, deadline);
   *
   * const tx = router.createProgramBuilder(codeId)
   *   .withExecutableBalance(amount, deadline, signature)
   *   .build();
   * await tx.sendAndWaitForReceipt();
   * ```
   *
   * @example With both ABI interface and initial executable balance:
   * ```typescript
   * const deadline = BigInt(Date.now() + 60_000);
   * const { signature } = await wvara.prepareAndSignPermitData(router.address, amount, deadline);
   *
   * const tx = router.createProgramBuilder(codeId)
   *   .withAbiInterface(abiContractAddress)
   *   .withExecutableBalance(amount, deadline, signature)
   *   .build();
   * await tx.sendAndWaitForReceipt();
   * const programId = await tx.getProgramId();
   * ```
   *
   * @example With a deterministic address (salt) and custom initializer:
   * ```typescript
   * const tx = router.createProgramBuilder(codeId)
   *   .withSalt('0x' + '00'.repeat(32))
   *   .withOverrideInitializer(initializerAddress)
   *   .build();
   * await tx.sendAndWaitForReceipt();
   * ```
   */
  createProgramBuilder(codeId: Hex): CreateProgramBuilder {
    return new CreateProgramBuilder(codeId, this._pc, () => this._ensureSigner(), this.address);
  }
}

/**
 * Creates a new RouterContract instance.
 *
 * @param params - {@link RouterContractClientParams} parameters for creating the Router contract client
 * @returns A new {@link RouterClient} instance that implements the {@link IRouterContract} interface
 */
export function getRouterClient(params: RouterContractClientParams): RouterClient {
  return new RouterClient(params);
}
