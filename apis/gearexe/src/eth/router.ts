import { generateCodeHash } from 'gear-js-util';
import { BaseContract, Signer, Wallet, ethers } from 'ethers';
import { loadKZG } from 'kzg-wasm';
import { GearExeApi } from '../api/api.js';
import { IROUTER_INTERFACE, IRouterContract } from './abi/index.js';
import { TxManager, TxManagerWithHelpers } from './tx-manager.js';
import { DevBlobHelpers, CodeValidationHelpers, CreateProgramHelpers, CodeState } from './interfaces/router.js';
import { ITxManager } from './interfaces/tx-manager.js';

// Interfaces moved to ./interfaces/router.js

/**
 * A contract wrapper for interacting with a Router contract on the Gear.Exe network.
 * Provides methods for code validation, program creation, and other router-related operations.
 */
export class RouterContract extends BaseContract implements IRouterContract {
  private _wallet: Wallet | Signer;

  /**
   * Creates a new RouterContract instance.
   *
   * @param address - The address of the Router contract
   * @param wallet - The wallet or signer to use for transactions
   */
  constructor(address: string, wallet: Wallet | Signer) {
    super(address, IROUTER_INTERFACE, wallet);
    this._wallet = wallet;
  }

  declare areValidators: (validators: string[]) => Promise<boolean>;
  declare codesStates: (codesIds: string[]) => Promise<bigint[]>;
  declare computeSettings: () => Promise<any>;
  declare genesisBlockHash: () => Promise<string>;
  declare genesisTimestamp: () => Promise<bigint>;
  declare isValidator: (validator: string) => Promise<boolean>;
  declare latestCommittedBlockHash: () => Promise<string>;
  declare mirrorImpl: () => Promise<string>;
  declare programCodeId: (programId: string) => Promise<string>;
  declare programsCodeIds: (programsIds: string[]) => Promise<string[]>;
  declare programsCount: () => Promise<bigint>;
  declare signingThresholdPercentage: () => Promise<bigint>;
  declare validatedCodesCount: () => Promise<bigint>;
  declare validators: () => Promise<string[]>;
  declare validatorsAggregatedPublicKey: () => Promise<any>;
  declare validatorsCount: () => Promise<bigint>;
  declare validatorsThreshold: () => Promise<bigint>;
  declare validatorsVerifiableSecretSharingCommitment: () => Promise<string>;
  declare wrappedVara: () => Promise<string>;

  /**
   * Gets the validation state of a code.
   *
   * @param codeId - The ID of the code to check
   * @returns Promise resolving to the code state
   * @throws Error if the code state is invalid
   */
  async codeState(codeId: string): Promise<CodeState> {
    const fn = this.getFunction('codeState');
    const _state = await fn.staticCall(codeId);
    switch (_state) {
      case 0n: {
        return CodeState.Unknown;
      }
      case 1n: {
        return CodeState.ValidationRequested;
      }
      case 2n: {
        return CodeState.Validated;
      }
      default: {
        throw new Error('Invalid code state');
      }
    }
  }

  /**
   * Creates a blob from the provided code for on-chain submission.
   *
   * @param code - The code to convert to a blob
   * @returns The hexadecimal representation of the blob
   */
  createBlob(code: Uint8Array): string {
    const blob = prepareBlob(code);
    return ethers.hexlify(blob);
  }

  /**
   * Requests code validation in development mode without including the blob in the transaction.
   * This method can be used when Gear.Exe node is running in "dev" mode.
   *
   * @param code - The code to be validated
   * @param api - The Gear.Exe API instance
   * @returns A transaction manager with blob-specific helper functions, including the code ID and
   *          a function to wait for the code to be validated
   */
  async requestCodeValidationNoBlob(code: Uint8Array, api: GearExeApi): Promise<TxManagerWithHelpers<DevBlobHelpers>> {
    const codeId = generateCodeHash(code);

    const transaction = await this.getFunction('requestCodeValidation').populateTransaction(codeId);

    const blob = prepareBlob(code);

    if (blob.length != 4096 * 32) {
      throw new Error('Invalid blob size');
    }

    const kzg = await loadKZG();

    const tx: ethers.TransactionRequest = {
      type: 3,
      data: transaction.data,
      to: transaction.to,
      gasLimit: 5_000_000n,
      maxFeePerBlobGas: 400_000_000_000,
      blobs: [blob],
      kzg,
    };

    const txManager: ITxManager = new TxManager(
      this._wallet,
      tx,
      IROUTER_INTERFACE,
      {
        processDevBlob: (manager) => async () => {
          const txResponse = await manager.send();
          return (await api.provider.send('dev_setBlob', [txResponse.hash, ethers.hexlify(new Uint8Array(code))])) as [
            string,
            string,
          ];
        },
      },
      {
        codeId,
        waitForCodeGotValidated: () =>
          new Promise<boolean>((resolve, reject) =>
            this.on('CodeGotValidated', (_codeId, valid) => {
              if (_codeId == codeId) {
                if (valid) {
                  resolve(true);
                } else {
                  reject(new Error('Code validation failed'));
                }
              }
            }),
          ),
      },
    );

    return txManager as TxManagerWithHelpers<DevBlobHelpers>;
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

    const transaction = await this.getFunction('requestCodeValidation').populateTransaction(codeId);

    const blob = prepareBlob(code);

    if (blob.length != 4096 * 32) {
      throw new Error('Invalid blob size');
    }

    const kzg = await loadKZG();

    const tx: ethers.TransactionRequest = {
      type: 3,
      data: transaction.data,
      to: transaction.to,
      gasLimit: 5_000_000n,
      maxFeePerBlobGas: 400_000_000_000,
      blobs: [blob],
      kzg,
    };

    const txManager: ITxManager = new TxManager(this._wallet, tx, IROUTER_INTERFACE, {
      codeId: () => codeId,
      waitForCodeGotValidated: () =>
        new Promise<boolean>((resolve, reject) =>
          this.on('CodeGotValidated', (_codeId, valid) => {
            if (_codeId == codeId) {
              if (valid) {
                resolve(true);
              } else {
                reject(new Error('Code validation failed'));
              }
            }
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
    codeId: string,
    overrideInitializer?: string,
    salt?: string,
  ): Promise<TxManagerWithHelpers<CreateProgramHelpers>> {
    const _salt = salt || ethers.hexlify(ethers.randomBytes(32));

    const tx = await this.getFunction('createProgram').populateTransaction(
      codeId,
      _salt,
      overrideInitializer || ethers.ZeroAddress,
    );

    const txManager: ITxManager = new TxManager(this._wallet, tx, IROUTER_INTERFACE, {
      getProgramId: (manager) => async () => {
        const event = await manager.findEvent('ProgramCreated');
        return event.args[0].toLowerCase();
      },
    });

    return txManager as TxManagerWithHelpers<CreateProgramHelpers>;
  }
}

/**
 * Creates a new RouterContract instance.
 *
 * @param id - The address of the Router contract
 * @param provider - Optional wallet or signer to use for transactions
 * @returns A new RouterContract instance that implements the IRouterContract interface
 */
export function getRouterContract(id: string, provider?: Wallet | Signer): RouterContract {
  return new RouterContract(id, provider);
}

/**
 * Prepares a blob from the provided data according to the Gear.Exe blob format.
 *
 * @param data - The data to prepare as a blob
 * @returns The prepared blob
 */
function prepareBlob(data: Uint8Array) {
  // https://docs.rs/alloy/latest/alloy/consensus/struct.SimpleCoder.html#behavior
  const BLOB_SIZE = 131_072;
  const paddedData = new Uint8Array(BLOB_SIZE);

  const dataLength = ethers.toBeArray(data.length);
  const length = new Uint8Array(32);
  length.set(dataLength, 1 + 8 - dataLength.length);

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
