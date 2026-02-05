import type { Address, Hex, PublicClient, TransactionRequest } from 'viem';
import { encodeFunctionData } from 'viem';

import {
  MessageHelpers,
  ReplyHelpers,
  MessageQueuingRequestedLog,
  Reply,
  ITxManager,
  ValueClaimingRequestedLog,
  type TxManagerWithHelpers,
} from './interfaces/index.js';
import { convertEventParams } from '../util/index.js';
import { IMIRROR_ABI, IMirrorContract } from './abi/IMirror.js';
import { TxManager } from './tx-manager.js';
import { ISigner } from '../types/signer.js';
import { BaseContractClient } from './base-contract.js';

/**
 * A contract wrapper for interacting with a Mirror contract.
 * Provides methods for sending messages, replies, claiming values, and managing balance.
 */
export class MirrorClient extends BaseContractClient implements IMirrorContract {
  router(): Promise<Address> {
    return this._pc.readContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'router',
    });
  }

  stateHash(): Promise<Hex> {
    return this._pc.readContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'stateHash',
    });
  }

  nonce(): Promise<bigint> {
    return this._pc.readContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'nonce',
    });
  }

  inheritor(): Promise<Address> {
    return this._pc.readContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'inheritor',
    });
  }

  initializer(): Promise<Address> {
    return this._pc.readContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'initializer',
    });
  }

  /**
   * Sends a message to the Mirror contract.
   *
   * @param payload - The message payload
   * @param value - The value to send with the message (in wei)
   * @returns A transaction manager with message-specific helper functions
   */
  async sendMessage(payload: string, value?: bigint): Promise<TxManagerWithHelpers<MessageHelpers>> {
    const signer = this._ensureSigner();
    // Set `callReply` to false since it's only used for calling sendMessage from contracts
    await this._pc.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'sendMessage',
      args: [payload as Hex, false],
      account: await signer.getAddress(),
    });

    const tx: TransactionRequest = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'sendMessage',
        args: [payload as Hex, false],
      }),
      value,
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IMIRROR_ABI, {
      getMessage: (manager) => async () => {
        const event = await manager.findEvent('MessageQueueingRequested');
        return convertEventParams<MessageQueuingRequestedLog>(event);
      },
      setupReplyListener: (manager) => async () => {
        const [receipt, event] = await Promise.all([
          manager.getReceipt(),
          manager.findEvent('MessageQueueingRequested'),
        ]);

        const message = convertEventParams<MessageQueuingRequestedLog>(event);

        return {
          txHash: receipt.transactionHash,
          blockNumber: Number(receipt.blockNumber),
          message: message,
          waitForReply: () => this.waitForReply(message.id, receipt.blockNumber),
        };
      },
    });

    return txManager as TxManagerWithHelpers<MessageHelpers>;
  }

  /**
   * Sends a reply to a previously received message.
   *
   * @param repliedTo - The ID of the message being replied to
   * @param payload - The reply payload
   * @param value - The value to send with the reply (in wei)
   * @returns A transaction manager with reply-specific helper functions
   */
  async sendReply(repliedTo: string, payload: string, value?: bigint): Promise<TxManagerWithHelpers<ReplyHelpers>> {
    const signer = this._ensureSigner();
    await this._pc.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'sendReply',
      args: [repliedTo as Hex, payload as Hex],
      account: await signer.getAddress(),
      value,
    });

    const tx: TransactionRequest = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'sendReply',
        args: [repliedTo as Hex, payload as Hex],
      }),
      value,
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IMIRROR_ABI, {
      getEvent: (manager) => async () => {
        return manager.findEvent('ReplyQueueingRequested');
      },
    });

    return txManager as TxManagerWithHelpers<ReplyHelpers>;
  }

  /**
   * Claims a value associated with the given ID.
   *
   * @param claimedId - The ID of the value to claim
   * @returns A transaction manager with claim-specific helper functions
   */
  async claimValue(claimedId: string): Promise<
    TxManagerWithHelpers<{
      getValueClaimingRequestedEvent: () => Promise<ValueClaimingRequestedLog>;
    }>
  > {
    const signer = this._ensureSigner();
    await this._pc.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'claimValue',
      args: [claimedId as Hex],
      account: await signer.getAddress(),
    });

    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'claimValue',
        args: [claimedId as Hex],
      }),
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IMIRROR_ABI, {
      getValueClaimingRequestedEvent: (manager) => async () => {
        const event = await manager.findEvent('ValueClaimingRequested');
        return convertEventParams<ValueClaimingRequestedLog>(event);
      },
    });

    return txManager as TxManagerWithHelpers<{
      getValueClaimingRequestedEvent: () => Promise<ValueClaimingRequestedLog>;
    }>;
  }

  /**
   * Tops up the executable balance of the program.
   *
   * @param value - The amount to top up
   */
  async executableBalanceTopUp(value: bigint): Promise<ITxManager> {
    const signer = this._ensureSigner();
    await this._pc.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'executableBalanceTopUp',
      args: [value],
      account: await signer.getAddress(),
    });

    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'executableBalanceTopUp',
        args: [value],
      }),
    };

    const txManager: ITxManager = new TxManager(this._pc, signer, tx, IMIRROR_ABI);

    return txManager;
  }

  /**
   * Listens to StateChanged event on the mirror contract.
   * @param callback - a function that will be invoked with the new state hash when a StateChanged event occurs
   * @returns An unwatch function that can be called to stop listening to events
   */
  watchStateChangedEvent(callback: (newStateHash: Hex) => void) {
    return this._pc.watchContractEvent({
      address: this.address,
      abi: IMIRROR_ABI,
      eventName: 'StateChanged',
      onLogs: (logs) => {
        for (const log of logs) {
          callback(log.args.stateHash!);
        }
      },
    });
  }

  async waitForReply(messageId: Hex, fromBlockNumber?: bigint) {
    const id = messageId.toLowerCase();

    let _resolve: (value: Reply) => void | Promise<void>;
    let _reject: (error: Error) => void | Promise<void>;
    let settled = false;

    const promise = new Promise<Reply>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const unwatch = this._pc.watchContractEvent({
      address: this.address,
      abi: IMIRROR_ABI,
      eventName: 'Reply',
      onLogs: (logs) => {
        if (settled) return;

        for (const log of logs) {
          if (log.args.replyTo?.toLowerCase() === id) {
            settled = true;
            const { payload, value, replyCode } = log.args;
            if (payload === undefined || value === undefined || replyCode === undefined) {
              _reject(new Error('Invalid reply event'));
            } else {
              _resolve({
                payload,
                value,
                replyCode,
                blockNumber: Number(log.blockNumber),
                txHash: log.transactionHash,
              });
            }
          }
        }
      },
      fromBlock: fromBlockNumber,
    });

    try {
      return await promise;
    } finally {
      unwatch();
    }
  }
}

/**
 * Creates a new MirrorContract instance.
 *
 * @param address - The address of the Mirror contract
 * @param signer - The signer for sending transactions
 * @param publicClient - The public client for reading data
 * @returns A new MirrorContract instance that implements the IMirrorContract interface
 */
export function getMirrorClient(address: Address, signer: ISigner, publicClient: PublicClient): MirrorClient {
  return new MirrorClient({ address, publicClient, signer });
}
