import { BaseContract, ContractEventPayload, Wallet } from 'ethers';
import { HexString } from 'gear-js-util';
import { convertEventParams as convertEventParameters } from '../util/index.js';
import { TxManager, TxManagerWithHelpers } from './tx-manager.js';
import { IMIRROR_INTERFACE, IMirrorContract } from './abi/IMirror.js';
import { MessageHelpers, ReplyHelpers, MessageQueuingRequestedLog, Reply } from './interfaces/mirror.js';
import { ITxManager } from './interfaces/index.js';

// Interfaces moved to ./interfaces/mirror.js

function getReplyListener(messageId: string) {
  let _resolve: (value: Reply) => void | Promise<void>;
  let _reject;

  const promise = new Promise<Reply>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  const listener = (
    payload: HexString,
    value: bigint,
    replyTo: string,
    replyCode: string,
    eventPayload: ContractEventPayload,
  ) => {
    if (replyTo.toLowerCase() === messageId.toLowerCase()) {
      _resolve({
        payload,
        value,
        replyCode,
        blockNumber: eventPayload.log.blockNumber,
        txHash: eventPayload.log.transactionHash as HexString,
      });
    }
  };

  return { listener, promise };
}

/**
 * A contract wrapper for interacting with a Mirror contract on the Gear.Exe network.
 * Provides methods for sending messages, replies, claiming values, and managing balance.
 */
export class MirrorContract extends BaseContract implements IMirrorContract {
  private _wallet: Wallet;

  declare decoder: () => Promise<HexString>;
  declare router: () => Promise<HexString>;
  declare stateHash: () => Promise<HexString>;
  declare nonce: () => Promise<bigint>;
  declare inheritor: () => Promise<HexString>;
  declare initializer: () => Promise<HexString>;

  /**
   * Creates a new MirrorContract instance.
   *
   * @param address - The address of the Mirror contract
   * @param wallet - The wallet or signer to use for transactions
   */
  constructor(address: string, wallet: Wallet) {
    super(address, IMIRROR_INTERFACE, wallet);
    this._wallet = wallet;
  }

  /**
   * Sends a message to the Mirror contract.
   *
   * @param payload - The message payload
   * @param value - The value to send with the message (in wei)
   * @returns A transaction manager with message-specific helper functions
   */
  async sendMessage(payload: string, value: bigint | number): Promise<TxManagerWithHelpers<MessageHelpers>> {
    const fn = this.getFunction('sendMessage');
    // Set `callReply` to false since it's only used for calling sendMessage from contracts
    const tx = await fn.populateTransaction(payload, value, false);

    const txManager: ITxManager = new TxManager(this._wallet, tx, IMIRROR_INTERFACE, {
      getMessage: (manager) => async () => {
        const event = await manager.findEvent('MessageQueueingRequested');

        return convertEventParameters<MessageQueuingRequestedLog>(event);
      },
      setupReplyListener: (manager) => async () => {
        const [receipt, event] = await Promise.all([
          manager.getReceipt(),
          manager.findEvent('MessageQueueingRequested'),
        ]);

        const message = convertEventParameters<MessageQueuingRequestedLog>(event);

        const { listener, promise } = getReplyListener(message.id);
        this.on('Reply', listener);

        return {
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          message: message,
          waitForReply: promise.then((result) => {
            this.off('Reply', listener);
            return result;
          }),
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
  async sendReply(payload: string, value: bigint): Promise<TxManagerWithHelpers<ReplyHelpers>> {
    const fn = this.getFunction('sendReply');
    const tx = await fn.populateTransaction(payload, value);

    const txManager: ITxManager = new TxManager(this._wallet, tx, IMIRROR_INTERFACE, {
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
  async claimValue(claimedId: string): Promise<TxManager> {
    const fn = this.getFunction('claimValue');
    const tx = await fn.populateTransaction(claimedId);

    const txManager = new TxManager(this._wallet, tx, IMIRROR_INTERFACE, {
      getValueClaimingRequestedEvent: (manager) => async () => {
        const event = await manager.findEvent('ValueClaimingRequested');
        return convertEventParameters<MessageQueuingRequestedLog>(event);
      },
    });

    return txManager;
  }

  /**
   * Tops up the executable balance of the program.
   *
   * @param value - The amount to top up
   */
  async executableBalanceTopUp(value: bigint): Promise<TxManager> {
    const fn = this.getFunction('executableBalanceTopUp');
    const tx = await fn.populateTransaction(value);

    const txManager = new TxManager(this._wallet, tx, IMIRROR_INTERFACE);

    return txManager;
  }
}

/**
 * Creates a new MirrorContract instance.
 *
 * @param id - The address of the Mirror contract
 * @param provider - Optional wallet or signer to use for transactions
 * @returns A new MirrorContract instance that implements the IMirrorContract interface
 */
export function getMirrorContract(id: string, provider?: Wallet): MirrorContract {
  return new MirrorContract(id, provider);
}
