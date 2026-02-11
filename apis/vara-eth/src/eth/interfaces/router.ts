import { Hex } from 'viem';

/**
 * Helper functions for code validation.
 */
export interface CodeValidationHelpers {
  /**
   * The ID of the code being validated.
   */
  codeId: Hex;

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
  getProgramId: () => Promise<Hex>;
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
