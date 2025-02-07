import { Provider, BaseContract, Signer, EventLog, ContractEventPayload } from 'ethers';
import { convertEventParams as convertEventParameters } from '../util/index.js';
import { HexString } from '../types/index.js';

export interface MessageQueuingRequestedLog {
  id: HexString;
  source: HexString;
  payload: string;
  value: bigint;
}

export interface ExecutableBalanceTopUpRequestedLog {
  value: bigint;
}

export interface ReplyQueueingRequestedLog {
  repliedTo: HexString;
  source: HexString;
  payload: string;
  value: bigint;
}

export interface MessageQueueingRequestedLog {
  id: HexString;
  source: HexString;
  payload: string;
  value: bigint;
}

const mirrorAbi = [
  'function decoder() external view returns (address)',
  'function router() external view returns (address)',
  'function stateHash() external view returns (bytes32)',
  'function nonce() external view returns (uint256)',
  'function inheritor() external view returns (address)',

  'function sendMessage(bytes calldata payload, uint128 value) external returns (bytes32)',
  'function sendReply(bytes32 repliedTo, bytes calldata payload, uint128 value)',
  'function claimValue(bytes32 claimedId)',
  'function executableBalanceTopUp(uint128 value)',

  'event ValueClaimed(bytes32 claimedId, uint128 value)',
  'event Reply(bytes payload, uint128 value, bytes32 replyTo, bytes4 indexed replyCode)',
  'event Message(bytes32 id, address indexed destination, bytes payload, uint128 value)',
  'event StateChanged(bytes32 stateHash)',
  'event MessageQueueingRequested(bytes32 id, address indexed source, bytes payload, uint128 value)',
  'event ReplyQueueingRequested(bytes32 repliedTo, address indexed source, bytes payload, uint128 value)',
  'event ValueClaimingRequested(bytes32 claimedId, address indexed source)',
  'event ExecutableBalanceTopUpRequested(uint128 value)',
];

export interface IMirrorContract {
  decoder(): Promise<HexString>;
  router(): Promise<HexString>;
  stateHash(): Promise<HexString>;
  nonce(): Promise<number>;
  inheritor(): Promise<HexString>;
}

export interface Reply {
  payload: HexString;
  value: bigint;
  replyCode: string; // TODO: replace with specific type
  blockNumber: number;
  txHash: HexString;
}

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

export class MirrorContract extends BaseContract {
  constructor(address: string, wallet: Provider | Signer) {
    super(address, mirrorAbi, wallet);
  }

  async sendMessage(payload: string, value: bigint | number) {
    const function_ = this.getFunction('sendMessage');

    const response = await function_.send(payload, value);

    const receipt = await response.wait();

    const event = receipt.logs?.find(
      (log) => 'fragment' in log && log.fragment.name == 'MessageQueueingRequested',
    ) as EventLog;

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
  }

  async sendReply(payload: string, value: bigint) {
    const function_ = this.getFunction('sendReply');

    const response = await function_.send(payload, value);

    const receipt = await response.wait();

    const event = receipt.logs?.find((log) => 'fragment' in log && log.fragment.name == 'ReplyQueueingRequested');

    // TODO: type
    return event;
  }

  async claimValue(claimedId: string) {
    const function_ = this.getFunction('claimValue');

    const response = await function_.send(claimedId);

    const receipt = await response.wait();

    const event = receipt.logs?.find(
      (log) => 'fragment' in log && log.fragment.name == 'ValueClaimingRequested',
    ) as EventLog;

    return convertEventParameters<MessageQueuingRequestedLog>(event);
  }

  async executableBalanceTopUp(value: bigint) {
    const function_ = this.getFunction('executableBalanceTopUp');

    const response = await function_.send(value);

    const receipt = await response.wait();

    const event = receipt.logs?.find(
      (log) => 'fragment' in log && log.fragment.name == 'ExecutableBalanceTopUpRequested',
    ) as EventLog;

    return convertEventParameters<ExecutableBalanceTopUpRequestedLog>(event);
    // TODO: return waitForResult fn
  }
}

export function getMirrorContract(id: string, provider?: Provider | Signer): MirrorContract & IMirrorContract {
  return new MirrorContract(id, provider) as MirrorContract & IMirrorContract;
}
