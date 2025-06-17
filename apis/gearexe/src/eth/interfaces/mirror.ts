import { HexString } from 'gear-js-util';

/**
 * Helper functions for messages sent via the Mirror contract.
 */
export interface MessageHelpers extends Record<string, any> {
  /**
   * Gets the message details from the transaction.
   * @returns Promise resolving to the message queueing requested log
   */
  readonly getMessage: () => Promise<MessageQueuingRequestedLog>;

  /**
   * Sets up a listener for replies to the sent message.
   * @returns Promise resolving to an object containing transaction details and a promise that resolves when a reply is received
   */
  readonly setupReplyListener: () => Promise<{
    readonly txHash: string;
    readonly blockNumber: number;
    readonly message: MessageQueuingRequestedLog;
    readonly waitForReply: Promise<Reply>;
  }>;
}

/**
 * Helper functions for replies sent via the Mirror contract.
 */
export interface ReplyHelpers {
  /**
   * Gets the reply event from the transaction.
   * @returns Promise resolving to the event log
   */
  readonly getEvent: () => Promise<import('ethers').EventLog>;
}

/**
 * Represents a message queueing requested event log.
 */
export interface MessageQueuingRequestedLog {
  /**
   * The ID of the message.
   */
  id: HexString;

  /**
   * The source address of the message.
   */
  source: HexString;

  /**
   * The payload of the message.
   */
  payload: string;

  /**
   * The value attached to the message.
   */
  value: bigint;

  /**
   * Indicates whether the contract should call another contract
   * with the result of the execution or just emit the `Reply` event.
   */
  callReply: boolean;
}

/**
 * Represents a reply queueing requested event log.
 */
export interface ReplyQueueingRequestedLog {
  /**
   * The ID of the message being replied to.
   */
  repliedTo: HexString;

  /**
   * The source address of the reply.
   */
  source: HexString;

  /**
   * The payload of the reply.
   */
  payload: string;

  /**
   * The value attached to the reply.
   */
  value: bigint;
}

/**
 * Represents a reply to a message.
 */
export interface Reply {
  /**
   * The payload of the reply.
   */
  payload: HexString;

  /**
   * The value transferred with the reply.
   */
  value: bigint;

  /**
   * The reply code.
   * @todo Replace with specific type
   */
  replyCode: string;

  /**
   * The block number in which the reply was included.
   */
  blockNumber: number;

  /**
   * The transaction hash of the reply.
   */
  txHash: HexString;
}
