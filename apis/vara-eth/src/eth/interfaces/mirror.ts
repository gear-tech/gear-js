import { Address, Hex } from 'viem';

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
    readonly waitForReply: () => Promise<Reply>;
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
  readonly getEvent: () => Promise<any>;
}

/**
 * Represents a message queueing requested event log.
 */
export interface MessageQueuingRequestedLog {
  /**
   * The ID of the message.
   */
  id: Hex;

  /**
   * The source address of the message.
   */
  source: Hex;

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
  repliedTo: Hex;

  /**
   * The source address of the reply.
   */
  source: Hex;

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
  payload: Hex;

  /**
   * The value transferred with the reply.
   */
  value: bigint;

  /**
   * The reply code.
   */
  replyCode: string;

  /**
   * The block number in which the reply was included.
   */
  blockNumber: number;

  /**
   * The transaction hash of the reply.
   */
  txHash: Hex;
}

export interface ValueClaimingRequestedLog {
  claimedId: Hex;
  source: Address;
}
