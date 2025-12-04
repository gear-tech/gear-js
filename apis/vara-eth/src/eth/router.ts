import type { Account, Address, Chain, Hex, PublicClient, TransactionRequest, Transport, WalletClient } from 'viem';
import { toHex, zeroAddress, numberToBytes, hexToBytes, bytesToHex, encodeFunctionData } from 'viem';
import { randomBytes } from '@noble/hashes/utils';
import { loadKZG } from 'kzg-wasm';

import { CodeValidationHelpers, CreateProgramHelpers, CodeState } from './interfaces/router.js';
import { ITxManager, type TxManagerWithHelpers } from './interfaces/tx-manager.js';
import { IROUTER_ABI, IRouterContract } from './abi/index.js';
import { HexString } from '../types/index.js';
import { TxManager } from './tx-manager.js';
import { generateCodeHash } from '../util';

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
export class RouterClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> implements IRouterContract
{
  /**
   * Creates a new RouterClient instance.
   *
   * @param address - The address of the Router contract
   * @param walletClient - The wallet client for sending transactions and signing messages
   * @param publicClient - The public client for reading data from the blockchain
   */
  constructor(
    public readonly address: Address,
    private _wc: WalletClient<TTransport, TChain, TAccount>,
    private _pc: PublicClient<TTransport, TChain>,
  ) {}

  areValidators(validators: Address[]): Promise<boolean> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'areValidators',
      args: [validators],
    });
  }

  async codesStates(codeIds: HexString[]): Promise<CodeState[]> {
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

  genesisBlockHash(): Promise<HexString> {
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

  programCodeId(programId: HexString): Promise<string> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'programCodeId',
      args: [programId],
    });
  }

  programsCodeIds(programsIds: HexString[]): Promise<readonly HexString[]> {
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

  signingThresholdPercentage(): Promise<number> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'signingThresholdPercentage',
    });
  }

  validatedCodesCount(): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validatedCodesCount',
    });
  }

  validators(): Promise<readonly HexString[]> {
    return this._pc.readContract({
      address: this.address,
      abi: IROUTER_ABI,
      functionName: 'validators',
    });
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
  async codeState(codeId: HexString): Promise<CodeState> {
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
  async requestCodeValidation(code: Uint8Array): Promise<TxManagerWithHelpers<CodeValidationHelpers>> {
    const codeId = generateCodeHash(code);

    const data = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'requestCodeValidation',
      args: [codeId],
    });

    const blob = prepareBlob(code);

    if (blob.length != 4096 * 32) {
      throw new Error('Invalid blob size');
    }

    const kzg = await loadKZG();

    const tx = {
      type: 'eip4844' as const,
      data,
      to: this.address,
      gas: 5_000_000n,
      maxFeePerBlobGas: 400_000_000_000n,
      blobs: [blob],
      kzg: {
        blobToKzgCommitment: (blob: Uint8Array) => {
          const result = kzg.blobToKZGCommitment(bytesToHex(blob)) as Hex;
          return hexToBytes(result);
        },
        computeBlobKzgProof: (blob: Uint8Array, commitment: Uint8Array) => {
          const result = kzg.computeBlobKZGProof(bytesToHex(blob), bytesToHex(commitment)) as Hex;
          return hexToBytes(result);
        },
      },
      chain: null,
    };

    const request = await this._pc.prepareTransactionRequest(tx);

    console.log(request);

    const txManager: ITxManager = new TxManager(this._pc, this._wc, tx, IROUTER_ABI, undefined, {
      codeId,
      waitForCodeGotValidated: () =>
        new Promise<boolean>((resolve, reject) =>
          // TODO: consider listening from block where transaction was included
          this._pc.watchContractEvent({
            address: this.address,
            abi: IROUTER_ABI,
            eventName: 'CodeGotValidated',
            onLogs: (logs) => {
              for (const log of logs) {
                if (log.args.codeId == codeId) {
                  if (log.args.valid) {
                    resolve(true);
                  } else {
                    reject(new Error('Code validation failed'));
                  }
                }
              }
            },
          }),
        ),
    });

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
    codeId: HexString,
    overrideInitializer?: HexString,
    salt?: HexString,
  ): Promise<TxManagerWithHelpers<CreateProgramHelpers>> {
    const _salt = salt || toHex(randomBytes(32));

    const encodedData = encodeFunctionData({
      functionName: 'createProgram',
      args: [codeId, _salt, overrideInitializer || zeroAddress],
      abi: IROUTER_ABI,
    });

    const tx: TransactionRequest = {
      to: this.address,
      data: encodedData,
    };

    const txManager: ITxManager = new TxManager(this._pc, this._wc, tx, IROUTER_ABI, {
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
    codeId: HexString,
    abiInterfaceAddress: HexString,
    overrideInitializer?: HexString,
    salt?: HexString,
  ): Promise<TxManagerWithHelpers<CreateProgramHelpers>> {
    const _salt = salt || toHex(randomBytes(32));

    const encodedData = encodeFunctionData({
      abi: IROUTER_ABI,
      functionName: 'createProgramWithAbiInterface',
      args: [codeId, _salt, overrideInitializer || zeroAddress, abiInterfaceAddress.toLowerCase() as HexString],
    });

    const tx: TransactionRequest = {
      to: this.address,
      data: encodedData,
    };

    const txManager: ITxManager = new TxManager(this._pc, this._wc, tx, IROUTER_ABI, {
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
 * @param address - The address of the Router contract
 * @param walletClient - The wallet client for sending transactions
 * @param publicClient - The public client for reading data
 * @returns A new RouterContract instance that implements the IRouterContract interface
 */
export function getRouterClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
>(
  address: Address,
  walletClient: WalletClient<TTransport, TChain, TAccount>,
  publicClient: PublicClient<TTransport, TChain>,
): RouterClient<TTransport, TChain, TAccount> {
  return new RouterClient(address, walletClient, publicClient);
}

function prepareBlob(data: Uint8Array) {
  // https://docs.rs/alloy/latest/alloy/consensus/struct.SimpleCoder.html#behavior
  const BLOB_SIZE = 131_072;
  const paddedData = new Uint8Array(BLOB_SIZE);

  const dataLength = numberToBytes(data.length, { size: 32 });
  const length = new Uint8Array(32);
  length.set(dataLength, 0);

  paddedData.set(length, 0);

  let offset = 32;

  while (data.length > 0) {
    const chunk = data.slice(0, 31);
    paddedData.set(chunk, offset + 1);
    offset += 32;
    data = data.slice(31);
  }

  return paddedData;
}
