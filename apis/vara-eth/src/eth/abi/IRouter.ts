import { Hex } from 'viem';
import { CodeState } from '../interfaces/index.js';

export const IROUTER_ABI = [
  {
    type: 'function',
    name: 'areValidators',
    inputs: [{ name: 'validators', type: 'address[]', internalType: 'address[]' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'codeState',
    inputs: [{ name: 'codeId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum Gear.CodeState' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'codesStates',
    inputs: [{ name: 'codesIds', type: 'bytes32[]', internalType: 'bytes32[]' }],
    outputs: [{ name: '', type: 'uint8[]', internalType: 'enum Gear.CodeState[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'commitBatch',
    inputs: [
      {
        name: 'batchCommitment',
        type: 'tuple',
        internalType: 'struct Gear.BatchCommitment',
        components: [
          { name: 'blockHash', type: 'bytes32', internalType: 'bytes32' },
          { name: 'blockTimestamp', type: 'uint48', internalType: 'uint48' },
          { name: 'previousCommittedBatchHash', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'chainCommitment',
            type: 'tuple[]',
            internalType: 'struct Gear.ChainCommitment[]',
            components: [
              {
                name: 'transitions',
                type: 'tuple[]',
                internalType: 'struct Gear.StateTransition[]',
                components: [
                  { name: 'actorId', type: 'address', internalType: 'address' },
                  { name: 'newStateHash', type: 'bytes32', internalType: 'bytes32' },
                  { name: 'exited', type: 'bool', internalType: 'bool' },
                  { name: 'inheritor', type: 'address', internalType: 'address' },
                  { name: 'valueToReceive', type: 'uint128', internalType: 'uint128' },
                  {
                    name: 'valueClaims',
                    type: 'tuple[]',
                    internalType: 'struct Gear.ValueClaim[]',
                    components: [
                      { name: 'messageId', type: 'bytes32', internalType: 'bytes32' },
                      { name: 'destination', type: 'address', internalType: 'address' },
                      { name: 'value', type: 'uint128', internalType: 'uint128' },
                    ],
                  },
                  {
                    name: 'messages',
                    type: 'tuple[]',
                    internalType: 'struct Gear.Message[]',
                    components: [
                      { name: 'id', type: 'bytes32', internalType: 'bytes32' },
                      { name: 'destination', type: 'address', internalType: 'address' },
                      { name: 'payload', type: 'bytes', internalType: 'bytes' },
                      { name: 'value', type: 'uint128', internalType: 'uint128' },
                      {
                        name: 'replyDetails',
                        type: 'tuple',
                        internalType: 'struct Gear.ReplyDetails',
                        components: [
                          { name: 'to', type: 'bytes32', internalType: 'bytes32' },
                          { name: 'code', type: 'bytes4', internalType: 'bytes4' },
                        ],
                      },
                      { name: 'call', type: 'bool', internalType: 'bool' },
                    ],
                  },
                ],
              },
              { name: 'head', type: 'bytes32', internalType: 'bytes32' },
            ],
          },
          {
            name: 'codeCommitments',
            type: 'tuple[]',
            internalType: 'struct Gear.CodeCommitment[]',
            components: [
              { name: 'id', type: 'bytes32', internalType: 'bytes32' },
              { name: 'valid', type: 'bool', internalType: 'bool' },
            ],
          },
          {
            name: 'rewardsCommitment',
            type: 'tuple[]',
            internalType: 'struct Gear.RewardsCommitment[]',
            components: [
              {
                name: 'operators',
                type: 'tuple',
                internalType: 'struct Gear.OperatorRewardsCommitment',
                components: [
                  { name: 'amount', type: 'uint256', internalType: 'uint256' },
                  { name: 'root', type: 'bytes32', internalType: 'bytes32' },
                ],
              },
              {
                name: 'stakers',
                type: 'tuple',
                internalType: 'struct Gear.StakerRewardsCommitment',
                components: [
                  {
                    name: 'distribution',
                    type: 'tuple[]',
                    internalType: 'struct Gear.StakerRewards[]',
                    components: [
                      { name: 'vault', type: 'address', internalType: 'address' },
                      { name: 'amount', type: 'uint256', internalType: 'uint256' },
                    ],
                  },
                  { name: 'totalAmount', type: 'uint256', internalType: 'uint256' },
                  { name: 'token', type: 'address', internalType: 'address' },
                ],
              },
              { name: 'timestamp', type: 'uint48', internalType: 'uint48' },
            ],
          },
          {
            name: 'validatorsCommitment',
            type: 'tuple[]',
            internalType: 'struct Gear.ValidatorsCommitment[]',
            components: [
              {
                name: 'aggregatedPublicKey',
                type: 'tuple',
                internalType: 'struct Gear.AggregatedPublicKey',
                components: [
                  { name: 'x', type: 'uint256', internalType: 'uint256' },
                  { name: 'y', type: 'uint256', internalType: 'uint256' },
                ],
              },
              { name: 'verifiableSecretSharingCommitment', type: 'bytes', internalType: 'bytes' },
              { name: 'validators', type: 'address[]', internalType: 'address[]' },
              { name: 'eraIndex', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
      { name: 'signatureType', type: 'uint8', internalType: 'enum Gear.SignatureType' },
      { name: 'signatures', type: 'bytes[]', internalType: 'bytes[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
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
          { name: 'wvaraPerSecond', type: 'uint128', internalType: 'uint128' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createProgram',
    inputs: [
      { name: 'codeId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      { name: 'overrideInitializer', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createProgramWithAbiInterface',
    inputs: [
      { name: 'codeId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      { name: 'overrideInitializer', type: 'address', internalType: 'address' },
      { name: 'abiInterface', type: 'address', internalType: 'address' },
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
    inputs: [{ name: 'validator', type: 'address', internalType: 'address' }],
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
  { type: 'function', name: 'lookupGenesisHash', inputs: [], outputs: [], stateMutability: 'nonpayable' },
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
    name: 'programCodeId',
    inputs: [{ name: 'programId', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'programsCodeIds',
    inputs: [{ name: 'programsIds', type: 'address[]', internalType: 'address[]' }],
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
    name: 'requestCodeValidation',
    inputs: [{ name: 'codeId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMirror',
    inputs: [{ name: 'newMirror', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'signingThresholdPercentage',
    inputs: [],
    outputs: [{ name: '', type: 'uint16', internalType: 'uint16' }],
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
          { name: 'election', type: 'uint256', internalType: 'uint256' },
          { name: 'validationDelay', type: 'uint256', internalType: 'uint256' },
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
    inputs: [{ name: 'head', type: 'bytes32', indexed: false, internalType: 'bytes32' }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BatchCommitted',
    inputs: [{ name: 'hash', type: 'bytes32', indexed: false, internalType: 'bytes32' }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CodeGotValidated',
    inputs: [
      { name: 'codeId', type: 'bytes32', indexed: false, internalType: 'bytes32' },
      { name: 'valid', type: 'bool', indexed: true, internalType: 'bool' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CodeValidationRequested',
    inputs: [{ name: 'codeId', type: 'bytes32', indexed: false, internalType: 'bytes32' }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ComputationSettingsChanged',
    inputs: [
      { name: 'threshold', type: 'uint64', indexed: false, internalType: 'uint64' },
      { name: 'wvaraPerSecond', type: 'uint128', indexed: false, internalType: 'uint128' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProgramCreated',
    inputs: [
      { name: 'actorId', type: 'address', indexed: false, internalType: 'address' },
      { name: 'codeId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
    ],
    anonymous: false,
  },
  { type: 'event', name: 'StorageSlotChanged', inputs: [], anonymous: false },
  {
    type: 'event',
    name: 'ValidatorsCommittedForEra',
    inputs: [{ name: 'eraIndex', type: 'uint256', indexed: false, internalType: 'uint256' }],
    anonymous: false,
  },
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
   * Gets the mirror implementation address
   * @returns Promise resolving to the mirror implementation address
   */
  mirrorImpl(): Promise<string>;
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
   * Gets the signing threshold percentage for validators
   * @returns Promise resolving to the threshold percentage
   */
  signingThresholdPercentage(): Promise<number>;
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
