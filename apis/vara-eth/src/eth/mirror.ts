import type { Address, Hex } from 'viem';
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
import { HexString } from '../types/index.js';
import { EthereumClient } from './ethereumClient.js';

/**
 * A contract wrapper for interacting with a Mirror contract.
 * Provides methods for sending messages, replies, claiming values, and managing balance.
 */
export class MirrorContract implements IMirrorContract {
  /**
   * Creates a new MirrorContract instance.
   *
   * @param address - The address of the Mirror contract
   * @param ethereumClient - The Ethereum client instance
   */
  constructor(
    private address: Address,
    private ethereumClient: EthereumClient,
  ) {}

  router(): Promise<HexString> {
    return this.ethereumClient.readContract(this.address, IMIRROR_ABI, 'router');
  }

  stateHash(): Promise<HexString> {
    return this.ethereumClient.readContract(this.address, IMIRROR_ABI, 'stateHash');
  }

  nonce(): Promise<bigint> {
    return this.ethereumClient.readContract(this.address, IMIRROR_ABI, 'nonce');
  }

  async inheritor(): Promise<HexString> {
    return this.ethereumClient.readContract(this.address, IMIRROR_ABI, 'inheritor');
  }

  async initializer(): Promise<HexString> {
    return this.ethereumClient.readContract(this.address, IMIRROR_ABI, 'initializer');
  }

  /**
   * Sends a message to the Mirror contract.
   *
   * @param payload - The message payload
   * @param value - The value to send with the message (in wei)
   * @returns A transaction manager with message-specific helper functions
   */
  async sendMessage(payload: string): Promise<TxManagerWithHelpers<MessageHelpers>> {
    // Set `callReply` to false since it's only used for calling sendMessage from contracts
    await this.ethereumClient.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'sendMessage',
      args: [payload as Hex, false],
      account: this.ethereumClient.account,
    });

    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'sendMessage',
        args: [payload as Hex, false],
      }),
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IMIRROR_ABI, {
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

        let _resolve: (value: Reply) => void | Promise<void>;
        let _reject: (error: Error) => void | Promise<void>;
        let settled = false;

        const waitForReply = new Promise<Reply>((resolve, reject) => {
          _resolve = resolve;
          _reject = reject;
        });

        const unwatch = this.ethereumClient.watchEvent({
          address: this.address,
          abi: IMIRROR_ABI,
          eventName: 'Reply',
          onLogs: (logs) => {
            if (settled) return;

            for (const log of logs) {
              if (log.args.replyTo?.toLowerCase() === message.id.toLowerCase()) {
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
                unwatch();
              }
            }
          },
        });

        return {
          txHash: receipt.transactionHash,
          blockNumber: Number(receipt.blockNumber),
          message: message,
          waitForReply,
        };
      },
    });

    return txManager as TxManagerWithHelpers<MessageHelpers>;
  }

  /**
   * Sends a reply to a previously received message.
   *
   * @param payload - The reply payload
   * @param value - The value to send with the reply (in wei)
   * @returns A transaction manager with reply-specific helper functions
   */
  async sendReply(repliedTo: string, payload: string): Promise<TxManagerWithHelpers<ReplyHelpers>> {
    await this.ethereumClient.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'sendReply',
      args: [repliedTo as Hex, payload as Hex],
      account: this.ethereumClient.account,
    });

    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'sendReply',
        args: [repliedTo as Hex, payload as Hex],
      }),
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IMIRROR_ABI, {
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
    await this.ethereumClient.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'claimValue',
      args: [claimedId as Hex],
      account: this.ethereumClient.account,
    });

    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'claimValue',
        args: [claimedId as Hex],
      }),
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IMIRROR_ABI, {
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
    await this.ethereumClient.simulateContract({
      address: this.address,
      abi: IMIRROR_ABI,
      functionName: 'executableBalanceTopUp',
      args: [value],
      account: this.ethereumClient.account,
    });

    const tx = {
      to: this.address,
      data: encodeFunctionData({
        abi: IMIRROR_ABI,
        functionName: 'executableBalanceTopUp',
        args: [value],
      }),
    };

    const txManager: ITxManager = new TxManager(this.ethereumClient, tx, IMIRROR_ABI);

    return txManager;
  }

  listenToStateChangedEvent(cb: (newStateHash: Hex) => void) {
    return this.ethereumClient.publicClient.watchContractEvent({
      address: this.address,
      abi: IMIRROR_ABI,
      eventName: 'StateChanged',
      onLogs: (logs) => {
        for (const log of logs) {
          cb(log.args.stateHash!);
        }
      },
    });
  }
}

/**
 * Creates a new MirrorContract instance.
 *
 * @param address - The address of the Mirror contract
 * @param walletClient - The wallet client for sending transactions
 * @param publicClient - The public client for reading data
 * @returns A new MirrorContract instance that implements the IMirrorContract interface
 */
export function getMirrorClient(address: Address, ethereumClient: EthereumClient): MirrorContract {
  return new MirrorContract(address, ethereumClient);
}
