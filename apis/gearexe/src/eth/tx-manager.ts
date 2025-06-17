import { Interface } from 'ethers';
import { EventLog, Signer } from 'ethers';
import { TransactionReceipt, TransactionRequest, TransactionResponse, Wallet } from 'ethers';
import { ITxManager, TxManagerWithHelpers } from './interfaces/tx-manager.js';

/**
 * Manages Ethereum transactions with support for helper functions.
 * Provides utilities for handling transaction lifecycle, receipt retrieval,
 * and event processing.
 *
 * @template T - Type for transaction-dependent helper functions
 * @template U - Type for transaction-independent helper functions
 */
export class TxManager<T extends Record<string, any> = object, U extends Record<string, any> = object>
  implements ITxManager
{
  private _receipt: TransactionReceipt;
  private _response: Promise<TransactionResponse>;

  /**
   * Creates a new transaction manager.
   *
   * @param _wallet - The wallet or signer to use for transactions
   * @param _tx - The transaction request to manage
   * @param _iface - The interface to use for parsing events
   * @param txDependentHelperFns - Helper functions that depend on the transaction
   * @param txIndependentHelperFns - Helper functions that do not depend on the transaction
   */
  constructor(
    private _wallet: Wallet | Signer,
    private _tx: TransactionRequest,
    private _iface: Interface,
    txDependentHelperFns?: { [k in keyof T]: (manager: TxManager) => any },
    txIndependentHelperFns?: Record<keyof U, any>,
  ) {
    if (txDependentHelperFns) {
      const entries = Object.entries(txDependentHelperFns);
      entries.forEach(([name, fn]) => {
        this[name] = fn(this);
      });
    }

    if (txIndependentHelperFns) {
      Object.entries(txIndependentHelperFns).forEach(([name, fn]) => {
        this[name] = fn;
      });
    }
  }

  /**
   * Estimates gas for the transaction and sets the gas limit.
   *
   * @returns The estimated gas limit as a bigint
   */
  async estimateGas(): Promise<bigint> {
    this._tx.gasLimit = await this._wallet.estimateGas(this._tx);

    return this._tx.gasLimit;
  }

  /**
   * Sends the transaction to the network.
   *
   * @returns The transaction response
   */
  async send(): Promise<TransactionResponse> {
    this._response = this._wallet.sendTransaction(this._tx);
    return this._response;
  }

  /**
   * Sends the transaction and waits for the receipt.
   *
   * @returns The transaction receipt
   */
  async sendAndWaitForReceipt(): Promise<TransactionReceipt> {
    const response = await this.send();
    this._receipt = await response.wait();
    return this._receipt;
  }

  /**
   * Gets the transaction receipt, waiting for it if necessary.
   *
   * @returns The transaction receipt
   */
  async getReceipt(): Promise<TransactionReceipt> {
    return this._receipt || (await this._response).wait();
  }

  /**
   * Finds a specific event in the transaction receipt.
   *
   * @param eventName - The name of the event to find
   * @returns The event log
   * @throws Error if the event is not found in the transaction receipt
   */
  async findEvent(eventName: string): Promise<EventLog> {
    const receipt = await this.getReceipt();

    const event = receipt?.logs.find((log) => {
      if (log instanceof EventLog && log.fragment !== null) {
        return log.fragment.name === eventName;
      }

      return this._iface.getEventName(log.topics[0]) === eventName;
    });

    if (!event) {
      throw new Error(`${eventName} event not found in transaction receipt`);
    }

    return new EventLog(event, this._iface, this._iface.getEvent(eventName));
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

export { TxManagerWithHelpers };
