import type { Address, Hex } from 'viem';
import { toHex, zeroAddress, numberToBytes, hexToBytes, bytesToHex, encodeFunctionData } from 'viem';
import { randomBytes } from '@noble/hashes/utils';
import { loadKZG } from 'kzg-wasm';

import { CodeValidationHelpers, CreateProgramHelpers, CodeState } from './interfaces/router.js';
import { ITxManager, type TxManagerWithHelpers } from './interfaces/tx-manager.js';
import { IROUTER_ABI, IRouterContract } from './abi/index.js';
import { EthereumClient } from './ethereumClient.js';
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
export class RouterContract implements IRouterContract {
  /**
   * Creates a new RouterContract instance.
   *
   * @param address - The address of the Router contract
   * @param ethereumClient - The Ethereum client for sending transactions and reading data
   */
  constructor(
    public readonly address: Address,
    private ethereumClient: EthereumClient,
  ) {}

  areValidators(validators: Address[]): Promise<boolean> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'areValidators', [validators]);
  }

  async codesStates(codeIds: HexString[]): Promise<CodeState[]> {
    const states = await this.ethereumClient.readContract(this.address, IROUTER_ABI, 'codesStates', [codeIds]);

    return states.map((value) => getCodeState(value));
  }

  computeSettings(): Promise<{
    threshold: bigint;
    wvaraPerSecond: bigint;
  }> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'computeSettings');
  }

  genesisBlockHash(): Promise<HexString> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'genesisBlockHash');
  }

  genesisTimestamp(): Promise<number> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'genesisTimestamp');
  }

  isValidator(validator: string): Promise<boolean> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'isValidator', [validator as Address]);
  }

  latestCommittedBlockHash(): Promise<string> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'latestCommittedBatchHash');
  }

  mirrorImpl(): Promise<string> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'mirrorImpl');
  }

  programCodeId(programId: HexString): Promise<string> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'programCodeId', [programId]);
  }

  programsCodeIds(programsIds: HexString[]): Promise<readonly HexString[]> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'programsCodeIds', [programsIds]);
  }

  programsCount(): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'programsCount');
  }

  signingThresholdPercentage(): Promise<number> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'signingThresholdPercentage');
  }

  validatedCodesCount(): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'validatedCodesCount');
  }

  validators(): Promise<readonly HexString[]> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'validators');
  }

  async validatorsAggregatedPublicKey(): Promise<any> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'validatorsAggregatedPublicKey');
  }

  async validatorsCount(): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'validatorsCount');
  }

  async validatorsThreshold(): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'validatorsThreshold');
  }

  async validatorsVerifiableSecretSharingCommitment(): Promise<string> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'validatorsVerifiableSecretSharingCommitment');
  }

  async wrappedVara(): Promise<Hex> {
    return this.ethereumClient.readContract(this.address, IROUTER_ABI, 'wrappedVara');
  }

  /**
   * Gets the validation state of a code.
   *
   * @param codeId - The ID of the code to check
   * @returns Promise resolving to the code state
   * @throws Error if the code state is invalid
   */
  async codeState(codeId: HexString): Promise<CodeState> {
    const _state = await this.ethereumClient.readContract(this.address, IROUTER_ABI, 'codeState', [codeId]);

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

    const request = await this.ethereumClient.publicClient.prepareTransactionRequest(tx);

    console.log(request);

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IROUTER_ABI, undefined, {
      codeId,
      waitForCodeGotValidated: () =>
        new Promise<boolean>((resolve, reject) =>
          // TODO: consider listening from block where transaction was included
          this.ethereumClient.watchEvent({
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

    // const { request } = await this.ethereumClient.simulateContract({
    //   address: this.address,
    //   abi: IROUTER_ABI,
    //   functionName: 'createProgram',
    //   args: [codeId, _salt, overrideInitializer || zeroAddress],
    //   account: this.ethereumClient.account!,
    // });

    const tx = {
      to: this.address,
      data: encodedData,
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IROUTER_ABI, {
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
      args: [codeId, _salt, overrideInitializer || zeroAddress, abiInterfaceAddress],
    });

    const tx = {
      to: this.address,
      data: encodedData,
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IROUTER_ABI, {
      getProgramId: (manager) => async () => {
        const event = await manager.findEvent('ProgramCreated');
        return event.args.actorId.toLowerCase();
      },
    });

    await txManager.estimateGas();

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
export function getRouterClient(address: Address, ethereumClient: EthereumClient): RouterContract {
  return new RouterContract(address, ethereumClient);
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
