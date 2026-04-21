import type { Address, Hash, Hex } from 'viem';
import { encodeFunctionData } from 'viem/utils';

import {
  blobToKzgCommitment,
  calculateBlobVersionedHashesAndCommitments,
  computeBlobKzgProof,
  computeCellsAndKzgProofs,
  simpleSidecarEncode,
  waitForKzg,
} from '../../util/blob.js';
import { generateCodeHash } from '../../util/hash.js';
import { IROUTER_ABI, type IRouterContract } from '../abi/IRouter.js';
import { CodeState, type CodeValidationHelpers, type CreateProgramHelpers } from '../interfaces/router.js';
import type { ITxManager, TxManagerWithHelpers } from '../interfaces/tx-manager.js';
import { TxManager } from '../tx-manager.js';
import type { ContractClientParams } from './base.contract.js';
import { EIP712ContractClient } from './eip-712.contract.js';
import { getOverrideInitializer, getProgramId, getSalt, waitForCodeGotValidated } from './router.helper.js';

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

  constructor(params: Omit<ContractClientParams, 'abi'>) {
    super({ ...params, abi: IROUTER_ABI });
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
  timelines(): Promise<any> {
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
  async validatorsAggregatedPublicKey(): Promise<any> {
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
    const maxFeePerBlobGas = baseFeePerBlobGas * 3n;

    await waitForKzg();
    const { blobVersionedHashes, blobCommitmentsMap } = await calculateBlobVersionedHashesAndCommitments(blobs);

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
    };

    tx.gas = await this._pc.estimateGas(tx);

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
   *
   * @param code - The code to be validated
   * @returns A transaction manager with validation-specific helper functions, including
   *          the code ID and a function to wait for the code to be validated
   */
  public async requestCodeValidation(
    code: Uint8Array,
    deadline: bigint,
    v: number,
    r: Hex,
    s: Hex,
  ): Promise<TxManagerWithHelpers<CodeValidationHelpers>> {
    const codeId = generateCodeHash(code);

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
   * Requires two ECDSA signatures: one from the requester (for the validation request) and
   * one for the WVARA permit to cover the fee.
   * @param requester - Address on whose behalf the request is made
   * @param codeId - Expected code ID (`gprimitives::CodeId::generate(wasm_code)`)
   * @param blobHashes - Blob hashes of the EIP-4844/EIP-7594 transaction sidecars
   * @param deadline - Signature expiry timestamp
   * @param v1 - ECDSA `v` for the code validation signature
   * @param r1 - ECDSA `r` for the code validation signature
   * @param s1 - ECDSA `s` for the code validation signature
   * @param v2 - ECDSA `v` for the WVARA permit signature
   * @param r2 - ECDSA `r` for the WVARA permit signature
   * @param s2 - ECDSA `s` for the WVARA permit signature
   */
  requestCodeValidationOnBehalf(
    requester: Address,
    code: Uint8Array,
    blobHashes: Hex[],
    deadline: bigint,
    v1: number,
    r1: Hex,
    s1: Hex,
    v2: number,
    r2: Hex,
    s2: Hex,
  ): Promise<TxManagerWithHelpers<CodeValidationHelpers>> {
    const codeId = generateCodeHash(code);

    const data = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'requestCodeValidationOnBehalf',
      args: [requester, codeId, blobHashes, deadline, v1, r1, s1, v2, r2, s2],
    });

    return this._createRequestCodeValidationTxManager(data, code, codeId);
  }

  async prepareAndSignRequestCodeValidationPermitData(codeId: Hex, blobHashes: Hex[], deadline: bigint) {
    const signer = this._ensureSigner();
    const requester = await signer.getAddress();

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

    const { r, v, s } = await signer.signTypedData({
      message: { requester, codeId, blobHashes, nonce, deadline },
      types,
      primaryType: 'RequestCodeValidationOnBehalf',
      domain,
    });

    return { codeId, requester, blobHashes, deadline, signature: { r, v, s } };
  }

  private _createProgramTxManager(data: Hex): TxManagerWithHelpers<CreateProgramHelpers> {
    const txManager: ITxManager = new TxManager(this._pc, this._ensureSigner(), { to: this.address, data }, this._abi, {
      getProgramId,
    });

    return txManager as TxManagerWithHelpers<CreateProgramHelpers>;
  }

  /**
   * Creates a new program from validated code.
   *
   * @param codeId - The ID of the validated code to use
   * @param overrideInitializer - Optional address to override the initializer
   * @param salt - Optional salt for deterministic program address generation
   * @returns A transaction manager with program creation helper functions
   */
  createProgram(codeId: Hex, overrideInitializer?: Address, salt?: Hex): TxManagerWithHelpers<CreateProgramHelpers> {
    const encodedData = encodeFunctionData({
      functionName: 'createProgram',
      args: [codeId, getSalt(salt), getOverrideInitializer(overrideInitializer)],
      abi: IROUTER_ABI,
    });

    return this._createProgramTxManager(encodedData);
  }

  /**
   * Facilitates the creation of a program within the co-processor by associating it
   * with both a WASM code implementation and an ABI interface.
   * @param codeId - A unique identifier for the WASM implementation of the program.
   * @param abiInterfaceAddress - An address representing the ABI interface to be associated with the program.
   * @param overrideInitializer - (optional) An address that can override the program's initialization routine.
   * @param salt - (optional) A value used to ensure the uniqueness of the deployment address.
   * @returns
   */
  createProgramWithAbiInterface(
    codeId: Hex,
    abiInterfaceAddress: Address,
    overrideInitializer?: Address,
    salt?: Hex,
  ): TxManagerWithHelpers<CreateProgramHelpers> {
    const encodedData = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'createProgramWithAbiInterface',
      args: [codeId, getSalt(salt), getOverrideInitializer(overrideInitializer), abiInterfaceAddress],
    });

    return this._createProgramTxManager(encodedData);
  }

  /**
   * Creates a program with an ABI interface and an initial WVARA executable balance.
   * Uses a WVARA permit signature so the fee transfer does not require a prior `approve` call.
   * Emits `ProgramCreated`. The resulting Mirror is deployed with `isSmall = false` (Etherscan-compatible ABI).
   * @param codeId - Validated code ID
   * @param salt - Salt for deterministic address derivation
   * @param overrideInitializer - Initializer address; uses `msg.sender` when `address(0)`
   * @param abiInterface - ABI interface address for Etherscan display
   * @param value - Initial WVARA executable balance to transfer to the Mirror
   * @param deadline - Permit signature expiry timestamp
   * @param v - ECDSA `v` for the WVARA permit
   * @param r - ECDSA `r` for the WVARA permit
   * @param s - ECDSA `s` for the WVARA permit
   * @returns Address of the created Mirror (program)
   */
  createProgramWithAbiInterfaceAndValue(
    codeId: Hex,
    salt: Hex,
    overrideInitializer: Address,
    abiInterface: Address,
    value: bigint,
    deadline: bigint,
    v: number,
    r: Hex,
    s: Hex,
  ): TxManagerWithHelpers<CreateProgramHelpers> {
    const encodedData = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'createProgramWithAbiInterfaceAndValue',
      args: [
        codeId,
        getSalt(salt),
        getOverrideInitializer(overrideInitializer),
        abiInterface,
        value,
        deadline,
        v,
        r,
        s,
      ],
    });

    return this._createProgramTxManager(encodedData);
  }

  /**
   * Creates a program with an initial WVARA executable balance.
   * Uses a WVARA permit signature so the fee transfer does not require a prior `approve` call.
   * Emits `ProgramCreated`. The resulting Mirror is deployed with `isSmall = true` (gas-efficient, no ABI).
   * @param codeId - Validated code ID
   * @param salt - Salt for deterministic address derivation
   * @param overrideInitializer - Initializer address; uses `msg.sender` when `address(0)`
   * @param value - Initial WVARA executable balance to transfer to the Mirror
   * @param deadline - Permit signature expiry timestamp
   * @param v - ECDSA `v` for the WVARA permit
   * @param r - ECDSA `r` for the WVARA permit
   * @param s - ECDSA `s` for the WVARA permit
   * @returns Address of the created Mirror (program)
   */
  createProgramWithValue(
    codeId: Hex,
    salt: Hex,
    overrideInitializer: Address,
    value: bigint,
    deadline: bigint,
    v: number,
    r: Hex,
    s: Hex,
  ): TxManagerWithHelpers<CreateProgramHelpers> {
    const encodedData = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'createProgramWithValue',
      args: [codeId, getSalt(salt), getOverrideInitializer(overrideInitializer), value, deadline, v, r, s],
    });

    return this._createProgramTxManager(encodedData);
  }
}

/**
 * Creates a new RouterContract instance.
 *
 * @param params - {@link ContractClientParams} parameters for creating the Router contract client
 * @returns A new {@link RouterClient} instance that implements the {@link IRouterContract} interface
 */
export function getRouterClient(params: Omit<ContractClientParams, 'abi'>): RouterClient {
  return new RouterClient(params);
}
