import { EventLog } from 'ethers';
import { TransactionReceipt, TransactionRequest, TransactionResponse } from 'ethers';

/**
 * A type that combines a TxManager with helper functions.
 *
 * @template T - The type of helper functions to include
 */
export type TxManagerWithHelpers<T extends Record<string, any>> = ITxManager & T;

/**
 * Manages Ethereum transactions with support for helper functions.
 * Provides utilities for handling transaction lifecycle, receipt retrieval,
 * and event processing.
 */
export interface ITxManager {
  /**
   * Estimates gas for the transaction and sets the gas limit.
   *
   * @returns The estimated gas limit as a bigint
   */
  estimateGas(): Promise<bigint>;

  /**
   * Sends the transaction to the network.
   *
   * @returns The transaction response
   */
  send(): Promise<TransactionResponse>;

  /**
   * Sends the transaction and waits for the receipt.
   *
   * @returns The transaction receipt
   */
  sendAndWaitForReceipt(): Promise<TransactionReceipt>;

  /**
   * Gets the transaction receipt, waiting for it if necessary.
   *
   * @returns The transaction receipt
   */
  getReceipt(): Promise<TransactionReceipt>;

  /**
   * Finds a specific event in the transaction receipt.
   *
   * @param eventName - The name of the event to find
   * @returns The event log
   * @throws Error if the event is not found in the transaction receipt
   */
  findEvent(eventName: string): Promise<EventLog>;

  /**
   * Gets the transaction request.
   *
   * @returns The transaction request
   */
  getTx(): TransactionRequest;
}
