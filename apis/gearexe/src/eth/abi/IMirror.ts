import { ethers } from 'ethers';

export const IMIRROR_ABI = [
  'function claimValue(bytes32 claimedId)',
  'function executableBalanceTopUp(uint128 value)',
  'function inheritor() view returns (address)',
  'function initialize(address initializer, address abiInterface, bool isSmall)',
  'function initializer() view returns (address)',
  'function nonce() view returns (uint256)',
  'function performStateTransition((address actorId, bytes32 newStateHash, bool exited, address inheritor, uint128 valueToReceive, (bytes32 messageId, address destination, uint128 value)[] valueClaims, (bytes32 id, address destination, bytes payload, uint128 value, (bytes32 to, bytes4 code) replyDetails, bool call)[] messages) transition) returns (bytes32)',
  'function router() view returns (address)',
  'function sendMessage(bytes payload, uint128 value, bool callReply) returns (bytes32)',
  'function sendReply(bytes32 repliedTo, bytes payload, uint128 value)',
  'function stateHash() view returns (bytes32)',
  'function transferLockedValueToInheritor()',
  'event ExecutableBalanceTopUpRequested(uint128 value)',
  'event Message(bytes32 id, address indexed destination, bytes payload, uint128 value)',
  'event MessageCallFailed(bytes32 id, address indexed destination, uint128 value)',
  'event MessageQueueingRequested(bytes32 id, address indexed source, bytes payload, uint128 value, bool callReply)',
  'event Reply(bytes payload, uint128 value, bytes32 replyTo, bytes4 indexed replyCode)',
  'event ReplyCallFailed(uint128 value, bytes32 replyTo, bytes4 indexed replyCode)',
  'event ReplyQueueingRequested(bytes32 repliedTo, address indexed source, bytes payload, uint128 value)',
  'event StateChanged(bytes32 stateHash)',
  'event ValueClaimed(bytes32 claimedId, uint128 value)',
  'event ValueClaimingRequested(bytes32 claimedId, address indexed source)',
];

export const IMIRROR_INTERFACE = new ethers.Interface(IMIRROR_ABI);

/**
 * Interface for IMirror contract methods
 * Mirror contract manages program state and message passing on Gear.Exe
 */
export interface IMirrorContract {
  /**
   * Gets the inheritor address of the mirror
   * @returns Promise resolving to the inheritor address
   */
  inheritor(): Promise<string>;

  /**
   * Gets the initializer address of the mirror
   * @returns Promise resolving to the initializer address
   */
  initializer(): Promise<string>;

  /**
   * Gets the current nonce of the mirror
   * @returns Promise resolving to the nonce
   */
  nonce(): Promise<bigint>;

  /**
   * Gets the router address associated with this mirror
   * @returns Promise resolving to the router address
   */
  router(): Promise<string>;

  /**
   * Gets the current state hash of the mirror
   * @returns Promise resolving to the state hash
   */
  stateHash(): Promise<string>;
}
