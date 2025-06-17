import { CodeState } from '../interfaces';
import { ethers } from 'ethers';

export const IROUTER_ABI = [
  'function areValidators(address[] validators) view returns (bool)',
  'function codeState(bytes32 codeId) view returns (uint8)',
  'function codesStates(bytes32[] codesIds) view returns (uint8[])',
  'function commitBatch(((bytes32 id, uint48 timestamp, bool valid)[] codeCommitments, (bytes32 hash, uint48 timestamp, bytes32 previousCommittedBlock, bytes32 predecessorBlock, (address actorId, bytes32 newStateHash, bool exited, address inheritor, uint128 valueToReceive, (bytes32 messageId, address destination, uint128 value)[] valueClaims, (bytes32 id, address destination, bytes payload, uint128 value, (bytes32 to, bytes4 code) replyDetails, bool call)[] messages)[] transitions)[] blockCommitments, ((uint256 amount, bytes32 root) operators, ((address vault, uint256 amount)[] distribution, uint256 totalAmount, address token) stakers, uint48 timestamp)[] rewardCommitments) batchCommitment, uint8 signatureType, bytes[] signatures)',
  'function commitValidators(((uint256 x, uint256 y) aggregatedPublicKey, bytes verifiableSecretSharingCommitment, address[] validators, uint256 eraIndex) validatorsCommitment, uint8 signatureType, bytes[] signatures)',
  'function computeSettings() view returns ((uint64 threshold, uint128 wvaraPerSecond))',
  'function createProgram(bytes32 codeId, bytes32 salt, address overrideInitializer) returns (address)',
  'function createProgramWithAbiInterface(bytes32 codeId, bytes32 salt, address overrideInitializer, address abiInterface) returns (address)',
  'function genesisBlockHash() view returns (bytes32)',
  'function genesisTimestamp() view returns (uint48)',
  'function isValidator(address validator) view returns (bool)',
  'function latestCommittedBlockHash() view returns (bytes32)',
  'function lookupGenesisHash()',
  'function mirrorImpl() view returns (address)',
  'function programCodeId(address programId) view returns (bytes32)',
  'function programsCodeIds(address[] programsIds) view returns (bytes32[])',
  'function programsCount() view returns (uint256)',
  'function requestCodeValidation(bytes32 codeId)',
  'function setMirror(address newMirror)',
  'function signingThresholdPercentage() view returns (uint16)',
  'function validatedCodesCount() view returns (uint256)',
  'function validators() view returns (address[])',
  'function validatorsAggregatedPublicKey() view returns ((uint256 x, uint256 y))',
  'function validatorsCount() view returns (uint256)',
  'function validatorsThreshold() view returns (uint256)',
  'function validatorsVerifiableSecretSharingCommitment() view returns (bytes)',
  'function wrappedVara() view returns (address)',
  'event BlockCommitted(bytes32 hash)',
  'event CodeGotValidated(bytes32 codeId, bool indexed valid)',
  'event CodeValidationRequested(bytes32 codeId)',
  'event ComputationSettingsChanged(uint64 threshold, uint128 wvaraPerSecond)',
  'event NextEraValidatorsCommitted(uint256 startTimestamp)',
  'event ProgramCreated(address actorId, bytes32 indexed codeId)',
  'event StorageSlotChanged()',
];

export const IROUTER_INTERFACE = new ethers.Interface(IROUTER_ABI);

/**
 * Interface for IRouter contract methods
 * Router contract manages validators, programs, and blockchain state on Gear.Exe
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
  codesStates(codesIds: string[]): Promise<bigint[]>;

  /**
   * Gets the current computation settings
   * @returns Promise resolving to computation settings with threshold and wVARA per second
   */
  computeSettings(): Promise<any>;

  /**
   * Gets the genesis block hash
   * @returns Promise resolving to the genesis block hash
   */
  genesisBlockHash(): Promise<string>;

  /**
   * Gets the genesis timestamp
   * @returns Promise resolving to the genesis timestamp
   */
  genesisTimestamp(): Promise<bigint>;

  /**
   * Checks if an address is a validator
   * @param validator - The address to check
   * @returns Promise resolving to true if the address is a validator
   */
  isValidator(validator: string): Promise<boolean>;

  /**
   * Gets the hash of the latest committed block
   * @returns Promise resolving to the latest committed block hash
   */
  latestCommittedBlockHash(): Promise<string>;

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
  programsCodeIds(programsIds: string[]): Promise<string[]>;

  /**
   * Gets the total number of created programs
   * @returns Promise resolving to the programs count
   */
  programsCount(): Promise<bigint>;

  /**
   * Gets the signing threshold percentage for validators
   * @returns Promise resolving to the threshold percentage
   */
  signingThresholdPercentage(): Promise<bigint>;

  /**
   * Gets the count of validated codes
   * @returns Promise resolving to the number of validated codes
   */
  validatedCodesCount(): Promise<bigint>;

  /**
   * Gets the list of current validators
   * @returns Promise resolving to array of validator addresses
   */
  validators(): Promise<string[]>;

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
