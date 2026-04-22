import type { Hex } from 'viem';

export const IMIRROR_ABI = [
  {
    type: 'function',
    name: 'claimValue',
    inputs: [{ name: '_claimedId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'executableBalanceTopUp',
    inputs: [{ name: '_value', type: 'uint128', internalType: 'uint128' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'executableBalanceTopUpWithPermit',
    inputs: [
      { name: '_value', type: 'uint128', internalType: 'uint128' },
      { name: '_deadline', type: 'uint256', internalType: 'uint256' },
      { name: '_v', type: 'uint8', internalType: 'uint8' },
      { name: '_r', type: 'bytes32', internalType: 'bytes32' },
      { name: '_s', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'exited',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'inheritor',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initializer',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nonce',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'router',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'sendMessage',
    inputs: [
      { name: '_payload', type: 'bytes', internalType: 'bytes' },
      { name: '_callReply', type: 'bool', internalType: 'bool' },
    ],
    outputs: [{ name: 'messageId', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'sendReply',
    inputs: [
      { name: '_repliedTo', type: 'bytes32', internalType: 'bytes32' },
      { name: '_payload', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'stateHash',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ExecutableBalanceTopUpRequested',
    inputs: [
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Message',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'destination',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'payload',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MessageCallFailed',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'destination',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MessageQueueingRequested',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'source',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'payload',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'callReply',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnedBalanceTopUpRequested',
    inputs: [
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Reply',
    inputs: [
      {
        name: 'payload',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'replyCode',
        type: 'bytes4',
        indexed: true,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ReplyCallFailed',
    inputs: [
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
      {
        name: 'replyTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'replyCode',
        type: 'bytes4',
        indexed: true,
        internalType: 'bytes4',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ReplyQueueingRequested',
    inputs: [
      {
        name: 'repliedTo',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'source',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'payload',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ReplyTransferFailed',
    inputs: [
      {
        name: 'destination',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StateChanged',
    inputs: [
      {
        name: 'stateHash',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TransferLockedValueToInheritorFailed',
    inputs: [
      {
        name: 'inheritor',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ValueClaimFailed',
    inputs: [
      {
        name: 'claimedId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ValueClaimed',
    inputs: [
      {
        name: 'claimedId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ValueClaimingRequested',
    inputs: [
      {
        name: 'claimedId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'source',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'AbiInterfaceAlreadySet', inputs: [] },
  { type: 'error', name: 'CallerNotRouter', inputs: [] },
  { type: 'error', name: 'EnforcedPause', inputs: [] },
  { type: 'error', name: 'EtherTransferToRouterFailed', inputs: [] },
  { type: 'error', name: 'InheritorMustBeZero', inputs: [] },
  { type: 'error', name: 'InitMessageNotCreated', inputs: [] },
  {
    type: 'error',
    name: 'InitMessageNotCreatedAndCallerNotInitializer',
    inputs: [],
  },
  { type: 'error', name: 'InitializerAlreadySet', inputs: [] },
  { type: 'error', name: 'InvalidActorId', inputs: [] },
  { type: 'error', name: 'InvalidFallbackCall', inputs: [] },
  { type: 'error', name: 'IsSmallAlreadySet', inputs: [] },
  { type: 'error', name: 'ProgramExited', inputs: [] },
  { type: 'error', name: 'ProgramNotExited', inputs: [] },
  {
    type: 'error',
    name: 'TransferLockedValueToInheritorExternalFailed',
    inputs: [],
  },
  { type: 'error', name: 'WVaraTransferFailed', inputs: [] },
] as const;

/**
 * Interface for IMirror contract methods
 */
export interface IMirrorContract {
  /**
   * Checks if the program has exited
   * @returns Promise resolving to true if exited
   */
  exited(): Promise<boolean>;

  /**
   * Gets the inheritor address
   * @returns Promise resolving to the inheritor address
   */
  inheritor(): Promise<string>;
  /**
   * Gets the initializer address
   * @returns Promise resolving to the initializer address
   */
  initializer(): Promise<string>;

  /**
   * Gets the current nonce
   * @returns Promise resolving to the nonce
   */
  nonce(): Promise<bigint>;

  /**
   * Gets the router address
   * @returns Promise resolving to the router address
   */
  router(): Promise<string>;

  /**
   * Gets the current state hash
   * @returns Promise resolving to the state hash
   */
  stateHash(): Promise<string>;
}
