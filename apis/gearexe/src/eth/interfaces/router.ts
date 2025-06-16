import { HexString } from 'gear-js-util';

/**
 * Helper functions for validating code blobs in development mode.
 */
export interface DevBlobHelpers {
  /**
   * Processes the development blob by sending it to the node.
   * @returns Promise resolving to a tuple of [codeId, hash]
   */
  processDevBlob: () => Promise<[string, string]>;

  /**
   * The ID of the code being validated.
   */
  codeId: string;

  /**
   * Waits for the code to be validated.
   * @returns Promise resolving to true if validation succeeded, rejects if validation failed
   */
  waitForCodeGotValidated: () => Promise<boolean>;
}

/**
 * Helper functions for code validation.
 */
export interface CodeValidationHelpers {
  /**
   * The ID of the code being validated.
   */
  codeId: string;

  /**
   * Waits for the code to be validated.
   * @returns Promise resolving to true if validation succeeded, rejects if validation failed
   */
  waitForCodeGotValidated: () => Promise<boolean>;
}

/**
 * Helper functions for program creation.
 */
export interface CreateProgramHelpers {
  /**
   * Gets the ID of the created program.
   * @returns Promise resolving to the program ID
   */
  getProgramId: () => Promise<HexString>;
}

/**
 * Represents the validation state of a code.
 */
export enum CodeState {
  /** Code is not yet submitted for validation */
  Unknown,
  /** Code validation has been requested but not yet completed */
  ValidationRequested,
  /** Code has been validated and is ready for use */
  Validated,
}
