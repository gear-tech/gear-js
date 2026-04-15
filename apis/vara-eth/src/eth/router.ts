import { randomBytes } from '@noble/hashes/utils';
import { loadKZG } from 'kzg-wasm';
import type { Address, Hex, TransactionRequest } from 'viem';
import { bytesToHex, encodeFunctionData, hexToBytes, sha256, toHex } from 'viem/utils';

import { ZERO_ADDRESS } from '../util/constants.js';
import { generateCodeHash } from '../util/hash.js';
import { IROUTER_ABI, type IRouterContract } from './abi/IRouter.js';
import { BaseContractClient, type ContractClientParams } from './base-contract.js';
import { CodeState, type CodeValidationHelpers, type CreateProgramHelpers } from './interfaces/router.js';
import type { ITxManager, TxManagerWithHelpers } from './interfaces/tx-manager.js';
import { TxManager } from './tx-manager.js';

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
 * A contract wrapper for interacting with a Router contract.
 * Provides methods for code validation, program creation, and other router-related operations.
 */
export class RouterClient extends BaseContractClient implements IRouterContract {
  areValidators(validators: Address[]): Promise<boolean> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'areValidators',
      args: [validators],
    });
  }

  async codesStates(codeIds: Hex[]): Promise<CodeState[]> {
    const states = await this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'codesStates',
      args: [codeIds],
    });

    return states.map((value) => getCodeState(value));
  }

  computeSettings(): Promise<{
    threshold: bigint;
    wvaraPerSecond: bigint;
  }> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'computeSettings',
    });
  }

  genesisBlockHash(): Promise<Hex> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'genesisBlockHash',
    });
  }

  genesisTimestamp(): Promise<number> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'genesisTimestamp',
    });
  }

  isValidator(validator: string): Promise<boolean> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'isValidator',
      args: [validator as Address],
    });
  }

  latestCommittedBlockHash(): Promise<string> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'latestCommittedBatchHash',
    });
  }

  mirrorImpl(): Promise<string> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'mirrorImpl',
    });
  }

  programCodeId(programId: Address): Promise<string> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'programCodeId',
      args: [programId],
    });
  }

  programsCodeIds(programsIds: Address[]): Promise<readonly Hex[]> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'programsCodeIds',
      args: [programsIds],
    });
  }

  programsCount(): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'programsCount',
    });
  }

  signingThresholdFraction(): Promise<readonly [bigint, bigint]> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'signingThresholdFraction',
    });
  }

  validatedCodesCount(): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validatedCodesCount',
    });
  }

  async validators(): Promise<Address[]> {
    const validators = await this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validators',
    });

    return validators.map((addr) => addr.toLowerCase() as Address);
  }

  async validatorsAggregatedPublicKey(): Promise<any> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validatorsAggregatedPublicKey',
    });
  }

  async validatorsCount(): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validatorsCount',
    });
  }

  async validatorsThreshold(): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validatorsThreshold',
    });
  }

  validatorsVerifiableSecretSharingCommitment(): Promise<string> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validatorsVerifiableSecretSharingCommitment',
    });
  }

  /**
   *
   * @returns The address of WrappedVara contract
   */
  wrappedVara(): Promise<Hex> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'wrappedVara',
    });
  }

  /**
   * Gets the validation state of a code.
   *
   * @param codeId - The ID of the code to check
   * @returns Promise resolving to the code state
   * @throws Error if the code state is invalid
   */
  async codeState(codeId: Hex): Promise<CodeState> {
    const _state = await this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'codeState',
      args: [codeId],
    });

    return getCodeState(_state);
  }

  /**
   * Requests code validation by submitting the code as a blob in the transaction.
   *
   * @param code - The code to be validated
   * @returns A transaction manager with validation-specific helper functions, including
   *          the code ID and a function to wait for the code to be validated
   */
  public async requestCodeValidation(code: Uint8Array): Promise<TxManagerWithHelpers<CodeValidationHelpers>> {
    const codeId = generateCodeHash(code);

    const data = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'requestCodeValidation',
      args: [codeId],
    });

    const blobs = simpleSidecarEncode(code);
    const kzg = await loadKZG();

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

    const blobCommitments = new Map(
      blobs.map((blob) => {
        const blobHex = bytesToHex(blob);
        return [blobHex, kzg.blobToKZGCommitment(blobHex) as Hex];
      }),
    );
    const blobVersionedHashes = [...blobCommitments.values()].map((c) => {
      const hash = sha256(c, 'bytes');
      hash.set([0x01], 0);
      return bytesToHex(hash);
    });

    const tx = {
      type: 'eip4844' as const,
      blobVersion: '7594' as const,
      data,
      to: this.address,
      gas: 100_000n,
      maxFeePerBlobGas,
      blobs,
      kzg: {
        blobToKzgCommitment: (blob: Uint8Array) => {
          const commitment = blobCommitments.get(bytesToHex(blob));
          if (!commitment) {
            throw new Error('Blob not found in commitments map');
          }
          return hexToBytes(commitment);
        },
        computeBlobKzgProof: (blob: Uint8Array, commitment: Uint8Array) => {
          const result = kzg.computeBlobKZGProof(bytesToHex(blob), bytesToHex(commitment)) as Hex;
          return hexToBytes(result);
        },
        computeCellsAndKzgProofs: (blob: Uint8Array): [Uint8Array[], Uint8Array[]] => {
          const [cells, proofs] = kzg.computeCellsAndProofs(bytesToHex(blob)) as [Hex[], Hex[]];
          return [cells.map((cell) => hexToBytes(cell)), proofs.map((proof) => hexToBytes(proof))];
        },
      },
      chain: null,
    };

    tx.gas = await this._pc.estimateGas(tx);

    await this._pc.prepareTransactionRequest(tx);

    const txManager: ITxManager = new TxManager(
      this._pc,
      this._signer!,
      tx,
      IROUTER_ABI,
      {
        waitForCodeGotValidated: (manager) => async () => {
          const { blockNumber } = await manager.getReceipt();
          let unwatch: (() => void) | undefined;
          try {
            return await new Promise<boolean>((resolve, reject) => {
              unwatch = this._pc.watchContractEvent({
                address: this.address,
                abi: IROUTER_ABI,
                eventName: 'CodeGotValidated',
                fromBlock: blockNumber,
                onLogs: (logs_1) => {
                  for (const log of logs_1) {
                    if (log.args.codeId === codeId) {
                      if (log.args.valid) {
                        resolve(true);
                      } else {
                        reject(new Error('Code validation failed'));
                      }
                    }
                  }
                },
              });
            });
          } finally {
            unwatch?.();
          }
        },
      },
      {
        codeId,
        blobVersionedHashes,
      },
    );

    return txManager as TxManagerWithHelpers<CodeValidationHelpers>;
  }

  /**
   * Creates a new program from validated code.
   *
   * @param codeId - The ID of the validated code to use
   * @param overrideInitializer - Optional address to override the initializer
   * @param salt - Optional salt for deterministic program address generation
   * @returns A transaction manager with program creation helper functions
   */
  async createProgram(
    codeId: Hex,
    overrideInitializer?: Address,
    salt?: Hex,
  ): Promise<TxManagerWithHelpers<CreateProgramHelpers>> {
    const signer = this._ensureSigner();
    const _salt = salt || toHex(randomBytes(32));

    const encodedData = encodeFunctionData({
      functionName: 'createProgram',
      args: [codeId, _salt, overrideInitializer || ZERO_ADDRESS],
      abi: IROUTER_ABI,
    });

    const tx: TransactionRequest = {
      to: this.address,
      data: encodedData,
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IROUTER_ABI, {
      getProgramId: (manager) => async () => {
        const event = await manager.findEvent('ProgramCreated');
        return event.args.actorId.toLowerCase();
      },
    });

    return txManager as TxManagerWithHelpers<CreateProgramHelpers>;
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
  async createProgramWithAbiInterface(
    codeId: Hex,
    abiInterfaceAddress: Address,
    overrideInitializer?: Address,
    salt?: Hex,
  ): Promise<TxManagerWithHelpers<CreateProgramHelpers>> {
    const signer = this._ensureSigner();
    const _salt = salt || toHex(randomBytes(32));

    const encodedData = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'createProgramWithAbiInterface',
      args: [codeId, _salt, overrideInitializer || ZERO_ADDRESS, abiInterfaceAddress],
    });

    const tx: TransactionRequest = {
      to: this.address,
      data: encodedData,
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IROUTER_ABI, {
      getProgramId: (manager) => async () => {
        const event = await manager.findEvent('ProgramCreated');
        return event.args.actorId.toLowerCase();
      },
    });

    return txManager as TxManagerWithHelpers<CreateProgramHelpers>;
  }
}

/**
 * Creates a new RouterContract instance.
 *
 * @param params - {@link ContractClientParams} parameters for creating the Router contract client
 * @returns A new {@link RouterClient} instance that implements the {@link IRouterContract} interface
 */
export function getRouterClient(params: ContractClientParams): RouterClient {
  return new RouterClient(params);
}

const BYTES_PER_BLOB = 131_072;
const FIELD_ELEMENTS_PER_BLOB = 4096;
const FE_BYTES = 32;
const USABLE_BYTES_PER_FE = 31;

function simpleSidecarEncode(data: Uint8Array): Uint8Array[] {
  const blobs: Uint8Array[] = [];
  let feCount = 0;

  const pushEmptyBlob = () => {
    blobs.push(new Uint8Array(BYTES_PER_BLOB));
  };

  const currentBlob = () => {
    const index = Math.floor(feCount / FIELD_ELEMENTS_PER_BLOB);
    while (blobs.length <= index) pushEmptyBlob();
    return blobs[index];
  };

  const feOffsetInCurrentBlob = () => (feCount % FIELD_ELEMENTS_PER_BLOB) * FE_BYTES;

  const ingestFE = (fe: Uint8Array) => {
    const blob = currentBlob();
    const offset = feOffsetInCurrentBlob();
    blob.set(fe, offset);
    feCount++;
  };

  if (data.length === 0) return blobs;

  const lenFE = new Uint8Array(FE_BYTES);
  const lenBytes = new DataView(lenFE.buffer);
  lenBytes.setBigUint64(1, BigInt(data.length));
  ingestFE(lenFE);

  let offset = 0;
  while (offset < data.length) {
    const fe = new Uint8Array(FE_BYTES);
    const chunkSize = Math.min(USABLE_BYTES_PER_FE, data.length - offset);
    fe.set(data.subarray(offset, offset + chunkSize), 1);
    offset += chunkSize;
    ingestFE(fe);
  }

  return blobs;
}
