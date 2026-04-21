import type { Hex } from 'viem';
import type { CodeState } from '../interfaces/index.js';
import { EIP712_ABI } from './EIP712.js';

export const IROUTER_ABI = [
  ...EIP712_ABI,
  {
    type: 'function',
    name: 'areValidators',
    inputs: [
      {
        name: '_validators',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'codeState',
    inputs: [{ name: '_codeId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum Gear.CodeState' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'codesStates',
    inputs: [
      {
        name: '_codesIds',
        type: 'bytes32[]',
        internalType: 'bytes32[]',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8[]',
        internalType: 'enum Gear.CodeState[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'computeSettings',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Gear.ComputationSettings',
        components: [
          { name: 'threshold', type: 'uint64', internalType: 'uint64' },
          {
            name: 'wvaraPerSecond',
            type: 'uint128',
            internalType: 'uint128',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createProgram',
    inputs: [
      { name: '_codeId', type: 'bytes32', internalType: 'bytes32' },
      { name: '_salt', type: 'bytes32', internalType: 'bytes32' },
      {
        name: '_overrideInitializer',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createProgramWithAbiInterface',
    inputs: [
      { name: '_codeId', type: 'bytes32', internalType: 'bytes32' },
      { name: '_salt', type: 'bytes32', internalType: 'bytes32' },
      {
        name: '_overrideInitializer',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_abiInterface',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createProgramWithAbiInterfaceAndValue',
    inputs: [
      { name: '_codeId', type: 'bytes32', internalType: 'bytes32' },
      { name: '_salt', type: 'bytes32', internalType: 'bytes32' },
      {
        name: '_overrideInitializer',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_abiInterface',
        type: 'address',
        internalType: 'address',
      },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
      { name: '_deadline', type: 'uint256', internalType: 'uint256' },
      { name: '_v', type: 'uint8', internalType: 'uint8' },
      { name: '_r', type: 'bytes32', internalType: 'bytes32' },
      { name: '_s', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createProgramWithValue',
    inputs: [
      { name: '_codeId', type: 'bytes32', internalType: 'bytes32' },
      { name: '_salt', type: 'bytes32', internalType: 'bytes32' },
      {
        name: '_overrideInitializer',
        type: 'address',
        internalType: 'address',
      },
      { name: '_value', type: 'uint128', internalType: 'uint128' },
      { name: '_deadline', type: 'uint256', internalType: 'uint256' },
      { name: '_v', type: 'uint8', internalType: 'uint8' },
      { name: '_r', type: 'bytes32', internalType: 'bytes32' },
      { name: '_s', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'genesisBlockHash',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'genesisTimestamp',
    inputs: [],
    outputs: [{ name: '', type: 'uint48', internalType: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isValidator',
    inputs: [{ name: '_validator', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'latestCommittedBatchHash',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'latestCommittedBatchTimestamp',
    inputs: [],
    outputs: [{ name: '', type: 'uint48', internalType: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'middleware',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mirrorImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nonces',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'programCodeId',
    inputs: [{ name: '_programId', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'programsCodeIds',
    inputs: [
      {
        name: '_programsIds',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    outputs: [{ name: '', type: 'bytes32[]', internalType: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'programsCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'requestCodeValidation',
    inputs: [
      { name: '_codeId', type: 'bytes32', internalType: 'bytes32' },
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
    name: 'requestCodeValidationBaseFee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'requestCodeValidationExtraFee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'requestCodeValidationOnBehalf',
    inputs: [
      { name: '_requester', type: 'address', internalType: 'address' },
      { name: '_codeId', type: 'bytes32', internalType: 'bytes32' },
      {
        name: '_blobHashes',
        type: 'bytes32[]',
        internalType: 'bytes32[]',
      },
      { name: '_deadline', type: 'uint256', internalType: 'uint256' },
      { name: '_v1', type: 'uint8', internalType: 'uint8' },
      { name: '_r1', type: 'bytes32', internalType: 'bytes32' },
      { name: '_s1', type: 'bytes32', internalType: 'bytes32' },
      { name: '_v2', type: 'uint8', internalType: 'uint8' },
      { name: '_r2', type: 'bytes32', internalType: 'bytes32' },
      { name: '_s2', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'signingThresholdFraction',
    inputs: [],
    outputs: [
      {
        name: 'thresholdNumerator',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'thresholdDenominator',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'timelines',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Gear.Timelines',
        components: [
          { name: 'era', type: 'uint256', internalType: 'uint256' },
          {
            name: 'election',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'validationDelay',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'validatedCodesCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'validators',
    inputs: [],
    outputs: [{ name: '', type: 'address[]', internalType: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'validatorsAggregatedPublicKey',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Gear.AggregatedPublicKey',
        components: [
          { name: 'x', type: 'uint256', internalType: 'uint256' },
          { name: 'y', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'validatorsCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'validatorsThreshold',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'validatorsVerifiableSecretSharingCommitment',
    inputs: [],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'wrappedVara',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AnnouncesCommitted',
    inputs: [
      {
        name: 'head',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BatchCommitted',
    inputs: [
      {
        name: 'hash',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CodeGotValidated',
    inputs: [
      {
        name: 'codeId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'valid',
        type: 'bool',
        indexed: true,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CodeValidationRequested',
    inputs: [
      {
        name: 'codeId',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ComputationSettingsChanged',
    inputs: [
      {
        name: 'threshold',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'wvaraPerSecond',
        type: 'uint128',
        indexed: false,
        internalType: 'uint128',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Paused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProgramCreated',
    inputs: [
      {
        name: 'actorId',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'codeId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StorageSlotChanged',
    inputs: [
      {
        name: 'slot',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Unpaused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ValidatorsCommittedForEra',
    inputs: [
      {
        name: 'eraIndex',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }],
  },
  { type: 'error', name: 'ApproveERC20Failed', inputs: [] },
  { type: 'error', name: 'BatchTimestampNotInPast', inputs: [] },
  { type: 'error', name: 'BatchTimestampTooEarly', inputs: [] },
  { type: 'error', name: 'BlobNotFound', inputs: [] },
  {
    type: 'error',
    name: 'CodeAlreadyOnValidationOrValidated',
    inputs: [],
  },
  { type: 'error', name: 'CodeNotValidated', inputs: [] },
  { type: 'error', name: 'CodeValidationNotRequested', inputs: [] },
  { type: 'error', name: 'CommitmentEraNotNext', inputs: [] },
  { type: 'error', name: 'ECDSAInvalidSignature', inputs: [] },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureLength',
    inputs: [{ name: 'length', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureS',
    inputs: [{ name: 's', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'ElectionNotStarted', inputs: [] },
  { type: 'error', name: 'EmptyValidatorsList', inputs: [] },
  { type: 'error', name: 'EnforcedPause', inputs: [] },
  { type: 'error', name: 'EraDurationTooShort', inputs: [] },
  { type: 'error', name: 'ErasTimestampMustNotBeEqual', inputs: [] },
  { type: 'error', name: 'ExpectedPause', inputs: [] },
  {
    type: 'error',
    name: 'ExpiredSignature',
    inputs: [{ name: 'deadline', type: 'uint256', internalType: 'uint256' }],
  },
  { type: 'error', name: 'FailedCall', inputs: [] },
  { type: 'error', name: 'GenesisHashAlreadySet', inputs: [] },
  { type: 'error', name: 'GenesisHashNotFound', inputs: [] },
  {
    type: 'error',
    name: 'InvalidBlobHash',
    inputs: [
      { name: 'index', type: 'uint256', internalType: 'uint256' },
      {
        name: 'providedBlobHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'expectedBlobHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
  },
  { type: 'error', name: 'InvalidElectionDuration', inputs: [] },
  {
    type: 'error',
    name: 'InvalidFROSTAggregatedPublicKey',
    inputs: [],
  },
  { type: 'error', name: 'InvalidFrostSignatureCount', inputs: [] },
  { type: 'error', name: 'InvalidFrostSignatureLength', inputs: [] },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  {
    type: 'error',
    name: 'InvalidPreviousCommittedBatchHash',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidSigner',
    inputs: [
      { name: 'signer', type: 'address', internalType: 'address' },
      { name: 'requester', type: 'address', internalType: 'address' },
    ],
  },
  { type: 'error', name: 'InvalidTimestamp', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  { type: 'error', name: 'PredecessorBlockNotFound', inputs: [] },
  { type: 'error', name: 'ReentrancyGuardReentrantCall', inputs: [] },
  {
    type: 'error',
    name: 'RewardsCommitmentEraNotPrevious',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RewardsCommitmentPredatesGenesis',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RewardsCommitmentTimestampNotInPast',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RouterGenesisHashNotInitialized',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SafeCastOverflowedUintDowncast',
    inputs: [
      { name: 'bits', type: 'uint8', internalType: 'uint8' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
    ],
  },
  { type: 'error', name: 'SignatureVerificationFailed', inputs: [] },
  { type: 'error', name: 'TimestampInFuture', inputs: [] },
  { type: 'error', name: 'TimestampOlderThanPreviousEra', inputs: [] },
  { type: 'error', name: 'TooManyChainCommitments', inputs: [] },
  { type: 'error', name: 'TooManyRewardsCommitments', inputs: [] },
  { type: 'error', name: 'TooManyValidatorsCommitments', inputs: [] },
  { type: 'error', name: 'TransferFromFailed', inputs: [] },
  { type: 'error', name: 'UUPSUnauthorizedCallContext', inputs: [] },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [{ name: 'slot', type: 'bytes32', internalType: 'bytes32' }],
  },
  { type: 'error', name: 'UnknownProgram', inputs: [] },
  { type: 'error', name: 'ValidationBeforeGenesis', inputs: [] },
  { type: 'error', name: 'ValidationDelayTooBig', inputs: [] },
  { type: 'error', name: 'ValidatorsAlreadyScheduled', inputs: [] },
  { type: 'error', name: 'ValidatorsNotFoundForTimestamp', inputs: [] },
  { type: 'error', name: 'ZeroValueTransfer', inputs: [] },
] as const;

/**
 * Interface for IRouter contract methods
 */
export interface IRouterContract {
  /**
   * Checks if all provided addresses are validators
   * @param validators - Array of validator addresses to check
   * @returns Promise resolving to true if all addresses are validators
   */
  areValidators(validators: string[]): Promise<boolean>;
  /**
   * Gets the validation state of a specific code
   * @param codeId - The ID of the code to check
   * @returns Promise resolving to the code state enum value
   */
  codeState(codeId: string): Promise<CodeState>;
  /**
   * Gets the validation states of multiple codes
   * @param codesIds - Array of code IDs to check
   * @returns Promise resolving to array of code state enum values
   */
  codesStates(codesIds: string[]): Promise<CodeState[]>;
  /**
   * Gets the current computation settings
   * @returns Promise resolving to computation settings with threshold and wVARA per second
   */
  computeSettings(): Promise<{
    threshold: bigint;
    wvaraPerSecond: bigint;
  }>;
  /**
   * Creates a new program with an ABI interface and value
   * @param codeId - The ID of the code to use
   * @param salt - Salt for address derivation
   * @param overrideInitializer - Optional initializer address override
   * @param abiInterface - The ABI interface address
   * @param value - Initial value for the program
   * @param deadline - Signature deadline
   * @param v - Signature v parameter
   * @param r - Signature r parameter
   * @param s - Signature s parameter
   * @returns Promise resolving to the new program address
   */
  /**
   * Gets the EIP-712 domain separator parameters
   */
  eip712Domain(): Promise<any>;
  /**
   * Gets the genesis block hash
   * @returns Promise resolving to the genesis block hash
   */
  genesisBlockHash(): Promise<string>;
  /**
   * Gets the genesis timestamp
   * @returns Promise resolving to the genesis timestamp
   */
  genesisTimestamp(): Promise<number>;
  /**
   * Checks if an address is a validator
   * @param validator - The address to check
   * @returns Promise resolving to true if the address is a validator
   */
  isValidator(validator: string): Promise<boolean>;
  /**
   * Gets the latest committed batch hash
   */
  latestCommittedBatchHash(): Promise<Hex>;
  /**
   * Gets the latest committed batch timestamp
   */
  latestCommittedBatchTimestamp(): Promise<number>;
  /**
   * Gets the middleware address
   */
  middleware(): Promise<string>;
  /**
   * Gets the mirror implementation address
   * @returns Promise resolving to the mirror implementation address
   */
  mirrorImpl(): Promise<string>;
  /**
   * Gets the owner address
   */
  owner(): Promise<string>;
  /**
   * Checks if the contract is paused
   */
  paused(): Promise<boolean>;
  /**
   * Gets the code ID for a specific program
   * @param programId - The program address to query
   * @returns Promise resolving to the code ID of the program
   */
  programCodeId(programId: string): Promise<string>;
  /**
   * Gets code IDs for multiple programs
   * @param programsIds - Array of program addresses to query
   * @returns Promise resolving to array of code IDs
   */
  programsCodeIds(programsIds: Hex[]): Promise<readonly Hex[]>;
  /**
   * Gets the total number of created programs
   * @returns Promise resolving to the programs count
   */
  programsCount(): Promise<bigint>;
  /**
   * Gets the base fee for code validation requests
   */
  requestCodeValidationBaseFee(): Promise<bigint>;
  /**
   * Gets the extra fee for code validation requests
   */
  requestCodeValidationExtraFee(): Promise<bigint>;
  /**
   * Gets the signing threshold fraction
   * @returns Promise resolving to the threshold percentage
   */
  signingThresholdFraction(): Promise<readonly [bigint, bigint]>;
  /**
   * Gets the timelines for eras and elections
   */
  timelines(): Promise<any>;
  /**
   * Gets the count of validated codes
   * @returns Promise resolving to the number of validated codes
   */
  validatedCodesCount(): Promise<bigint>;
  /**
   * Gets the list of current validators
   * @returns Promise resolving to array of validator addresses
   */
  validators(): Promise<readonly Hex[]>;
  /**
   * Gets the aggregated public key of current validators
   * @returns Promise resolving to the aggregated public key structure
   */
  validatorsAggregatedPublicKey(): Promise<any>;
  /**
   * Gets the total number of validators
   * @returns Promise resolving to the validators count
   */
  validatorsCount(): Promise<bigint>;
  /**
   * Gets the minimum number of validators required for consensus
   * @returns Promise resolving to the validators threshold
   */
  validatorsThreshold(): Promise<bigint>;
  /**
   * Gets the verifiable secret sharing commitment for validators
   * @returns Promise resolving to the VSS commitment bytes
   */
  validatorsVerifiableSecretSharingCommitment(): Promise<string>;
  /**
   * Gets the wrapped VARA token address
   * @returns Promise resolving to the wVARA token address
   */
  wrappedVara(): Promise<string>;
}
