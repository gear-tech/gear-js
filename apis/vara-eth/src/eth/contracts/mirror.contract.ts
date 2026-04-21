import type { Address, Hex, TransactionRequest, TransactionRequestBase } from 'viem';
import { encodeFunctionData } from 'viem';

import { convertEventParams } from '../../util/index.js';
import { IMIRROR_ABI, type IMirrorContract } from '../abi/IMirror.js';
import type {
  ITxManager,
  MessageHelpers,
  MessageQueuingRequestedLog,
  Reply,
  ReplyHelpers,
  TxManagerWithHelpers,
  ValueClaimingRequestedLog,
} from '../interfaces/index.js';
import { TxManager } from '../tx-manager.js';
import { BaseContractClient, type ContractClientParams } from './base.contract.js';

/**
 * Contract client for the Mirror contract.
 *
 * Mirror is the on-chain representation of a Gear program deployed inside the co-processor.
 * It exposes methods to send messages/replies, claim values, and top up the program's
 * executable balance. Every mutating call emits a *requesting* event that validator nodes
 * pick up and process inside the co-processor.
 */
export class MirrorClient extends BaseContractClient<typeof IMIRROR_ABI> implements IMirrorContract {
  private _cachedRouter: Address | undefined;

  constructor(params: Omit<ContractClientParams, 'abi'>) {
    super({ ...params, abi: IMIRROR_ABI });
  }

  /** Returns `true` if the program has exited. */
  exited(): Promise<boolean> {
    return this.read('exited');
  }

  /**
   * Returns the address of the `Router` contract that governs this Mirror.
   * Result is fetched once and cached for subsequent calls.
   */
  async router(): Promise<Address> {
    if (this._cachedRouter === undefined) {
      this._cachedRouter = await this.read('router');
    }

    return this._cachedRouter;
  }

  /** Returns the current state hash of the program. */
  stateHash(): Promise<Hex> {
    return this.read('stateHash');
  }

  /**
   * Returns the nonce used to generate unique message IDs.
   * Incremented with each message received from Ethereum; nonce 0 is always the init message.
   */
  nonce(): Promise<bigint> {
    return this.read('nonce');
  }

  /**
   * Returns the inheritor address set by the program on exit.
   * Any remaining program value is transferred to this address after exit.
   */
  inheritor(): Promise<Address> {
    return this.read('inheritor');
  }

  /** Returns the address eligible to send the first (init) message to the program. */
  initializer(): Promise<Address> {
    return this.read('initializer');
  }

  /**
   * Sends a message to the Mirror contract.
   *
   * @param payload - The message payload
   * @param value - The value to send with the message (in wei)
   * @returns A transaction manager with message-specific helper functions
   */
  async sendMessage(
    payload: string,
    value?: bigint,
    options?: Omit<TransactionRequestBase, 'to' | 'data' | 'value' | 'from' | 'type'>,
  ): Promise<TxManagerWithHelpers<MessageHelpers>> {
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
      ...options,
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
   * Tops up the executable balance with permit
   * @param value - The amount to top up
   * @param deadline - Signature deadline
   * @param v - Signature v parameter
   * @param r - Signature r parameter
   * @param s - Signature s parameter
   */
  executableBalanceTopUpWithPermit(_value: bigint, _deadline: bigint, _v: number, _r: Hex, _s: Hex): Promise<void> {
    // TODO: implement
    throw new Error('Method not implemented.');
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

  /**
   * Waits for a `Reply` event matching the given message ID.
   * @param messageId - ID of the sent message to wait for a reply to
   * @param fromBlockNumber - Start scanning from this block (use the send-tx block number to avoid missing events)
   * @returns Resolved reply payload, value, reply code, block number, and tx hash
   */
  async waitForReply(messageId: Hex, fromBlockNumber?: bigint) {
    const id = messageId.toLowerCase();

    let _resolve: (value: Reply) => void | Promise<void>;
    let _reject: (error: Error) => void | Promise<void>;
    let settled = false;

    const promise = new Promise<Reply>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    let unwatch: (() => void) | undefined;

    unwatch = this._pc.watchContractEvent({
      address: this.address,
      abi: IMIRROR_ABI,
      eventName: 'Reply',
      onLogs: (logs) => {
        if (settled) return;

        for (const log of logs) {
          if (log.args.replyTo?.toLowerCase() === id) {
            unwatch?.();
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
      unwatch?.();
    }
  }
}

/**
 * Creates a new MirrorContract instance.
 *
 * @param params - {@link ContractClientParams} parameters for creating the Mirror contract client
 * @returns A new {@link MirrorClient} instance that implements the {@link IMirrorContract} interface
 */
export function getMirrorClient(params: Omit<ContractClientParams, 'abi'>): MirrorClient {
  return new MirrorClient(params);
}
