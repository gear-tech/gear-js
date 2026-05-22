import type { Abi, Hex } from 'viem';
import { BaseError } from 'viem';
import { decodeErrorResult } from 'viem/utils';

/**
 * Extracts the `.details` string from a viem error, walking one level of cause chain
 * to handle wrapped execution errors (e.g. `EstimateGasExecutionError` wrapping a
 * `CallExecutionError`).
 */
function extractDetails(error: unknown): string {
  if (error instanceof BaseError) return error.details;
  const err = error as { cause?: unknown; details?: string; shortMessage?: string };
  if (err.cause instanceof BaseError) return err.cause.details;
  return err.details ?? err.shortMessage ?? '';
}

/**
 * Decodes a revert error from a failed contract call (e.g. estimateGas, simulateContract).
 *
 * Tries each supplied ABI in order, then falls back to an empty ABI so that standard
 * Solidity built-ins (`Error(string)`, `Panic(uint256)`) are always decoded.
 * Returns a plain `Error` with a human-readable message so the caller can throw it.
 *
 * @param error - The raw error thrown by viem (EstimateGasExecutionError, etc.)
 * @param abis  - Contract ABIs to search for the error selector, in priority order
 */
export function decodeContractError(error: unknown, abis: Abi[] = []): Error {
  const details = extractDetails(error);
  const match = details.match(/custom error (0x[0-9a-fA-F]+): ([0-9a-fA-F]*)/);

  if (match) {
    const errorData = (match[1] + match[2]) as Hex;
    for (const abi of abis) {
      try {
        const decoded = decodeErrorResult({ abi, data: errorData });
        return new Error(`${decoded.errorName}(${decoded.args?.join(', ') ?? ''})`, { cause: error });
      } catch {}
    }
    // fallback: handles built-in Error(string) and Panic(uint256)
    try {
      const decoded = decodeErrorResult({ abi: [], data: errorData });
      return new Error(`${decoded.errorName}(${decoded.args?.join(', ') ?? ''})`, { cause: error });
    } catch {}
    return new Error(`Unknown contract error ${match[1]}: ${match[2]}`, { cause: error });
  }

  return new Error(details || 'unknown contract error', { cause: error });
}
