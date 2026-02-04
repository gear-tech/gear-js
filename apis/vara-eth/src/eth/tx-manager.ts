import type {
  Abi,
  TransactionReceipt,
  Hash,
  ContractEventName,
  DecodeEventLogReturnType,
  Chain,
  SendTransactionRequest,
  EstimateGasParameters,
  TransactionRequest,
  Log,
  Hex,
  Transport,
  PublicClient,
} from 'viem';
import { decodeEventLog } from 'viem';

import { ITxManager } from './interfaces/tx-manager.js';
import { ISigner } from '../types/signer.js';

/**
 * Manages Ethereum transactions with support for helper functions.
 * Provides utilities for handling transaction lifecycle, receipt retrieval,
 * and event processing.
 *
 * @template T - Type for transaction-dependent helper functions
 * @template U - Type for transaction-independent helper functions
 */
export class TxManager<
  T extends Record<string, any> = object,
  U extends Record<string, any> = object,
  const abi extends Abi = Abi,
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TRequest extends SendTransactionRequest<TChain, undefined, TChain> = SendTransactionRequest<
    TChain,
    undefined,
    TChain
  >,
> implements ITxManager
{
  private _receipt: TransactionReceipt | null = null;
  private _hash: Hash | null = null;

  /**
   * Creates a new transaction manager.
   *
   * @param ethereumClient - The Ethereum client for sending transactions and reading data
   * @param _tx - The transaction request to manage
   * @param _abi - The ABI to use for parsing events
   * @param txDependentHelperFns - Helper functions that depend on the transaction
   * @param txIndependentHelperFns - Helper functions that do not depend on the transaction
   */
  constructor(
    private _pc: PublicClient<TTransport, TChain>,
    private _signer: ISigner,
    private _tx: TransactionRequest,
    private _abi: abi,
    txDependentHelperFns?: {
      [k in keyof T]: (manager: TxManager<T, U, abi, TTransport, TChain, TRequest>) => any;
    },
    txIndependentHelperFns?: Record<keyof U, any>,
  ) {
    if (txDependentHelperFns) {
      const entries = Object.entries(txDependentHelperFns);
      entries.forEach(([name, fn]) => {
        Object.assign(this, { [name]: fn(this) });
      });
    }

    if (txIndependentHelperFns) {
      Object.assign(this, txIndependentHelperFns);
    }
  }

  /**
   * Estimates gas for the transaction and sets the gas limit.
   *
   * @returns The estimated gas limit as a bigint
   */
  async estimateGas(): Promise<bigint> {
    try {
      const gasParams: EstimateGasParameters<TChain> = this._tx as EstimateGasParameters<TChain>;

      this._tx.gas = await this._pc.estimateGas(gasParams);

      return this._tx.gas;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Sends the transaction to the network.
   *
   * @returns The transaction hash
   */
  async send(): Promise<Hash> {
    const hash = await this._signer.sendTransaction(this._tx);
    this._hash = hash;
    return hash;
  }

  /**
   * Sends the transaction and waits for the receipt.
   *
   * @returns The transaction receipt
   */
  async sendAndWaitForReceipt(): Promise<TransactionReceipt> {
    const hash = await this.send();
    this._receipt = await this._pc.waitForTransactionReceipt({ hash });
    if (!this._receipt) {
      throw new Error('Transaction receipt not found');
    }
    return this._receipt;
  }

  /**
   * Gets the transaction receipt, waiting for it if necessary.
   *
   * @returns The transaction receipt
   */
  async getReceipt(): Promise<TransactionReceipt> {
    if (this._receipt) {
      return this._receipt;
    }
    if (this._hash) {
      this._receipt = await this._pc.waitForTransactionReceipt({ hash: this._hash });
      if (!this._receipt) {
        throw new Error('Transaction receipt not found');
      }
      return this._receipt;
    }
    throw new Error('No transaction hash available. Call send() first.');
  }

  /**
   * Finds a specific event in the transaction receipt.
   *
   * @param eventName - The name of the event to find
   * @returns The decoded event log with args
   * @throws Error if the event is not found in the transaction receipt
   */
  async findEvent<eventName extends ContractEventName<abi>>(
    eventName: eventName,
  ): Promise<DecodeEventLogReturnType<abi, eventName>> {
    const receipt = await this.getReceipt();

    const logs = receipt.logs as (Log & { topics: [Hex, ...Hex[]] })[]; // TODO: fixme

    for (const log of logs) {
      try {
        const decoded = decodeEventLog({
          abi: this._abi,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === eventName) {
          return decoded as DecodeEventLogReturnType<abi, eventName>;
        }
      } catch {
        continue;
      }
    }

    throw new Error(`${eventName} event not found in transaction receipt`);
  }

  /**
   * Gets the transaction request.
   *
   * @returns The transaction request
   */
  getTx(): TransactionRequest {
    return this._tx;
  }
}
