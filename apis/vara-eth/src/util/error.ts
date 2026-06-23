import type { Abi, Hex } from 'viem';
import { BaseError, RawContractError } from 'viem';
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
 * Walks the viem error cause chain to find a RawContractError carrying the raw
 * revert data as a hex string. estimateGas is ABI-unaware so viem never decodes
 * the revert automatically — the data is only available here.
 */
function extractRawData(error: unknown): Hex | null {
  let current: unknown = error;
  while (current instanceof BaseError) {
    if (current instanceof RawContractError && current.data) {
      return current.data as Hex;
    }
    current = current.cause;
  }
  return null;
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
  const rawData = extractRawData(error);

  if (rawData) {
    for (const abi of abis) {
      try {
        const decoded = decodeErrorResult({ abi, data: rawData });
        return new Error(`${decoded.errorName}(${decoded.args?.join(', ') ?? ''})`, { cause: error });
      } catch {}
    }
    try {
      const decoded = decodeErrorResult({ abi: [], data: rawData });
      return new Error(`${decoded.errorName}(${decoded.args?.join(', ') ?? ''})`, { cause: error });
    } catch {}
    return new Error(`Unknown contract error ${rawData}`, { cause: error });
  }

  // Fallback: parse the human-readable details string (format varies by node)
  const details = extractDetails(error);
  const hexMatch = details.match(/custom error (0x[0-9a-fA-F]+): ([0-9a-fA-F]*)/);
  if (hexMatch) {
    const errorData = (hexMatch[1] + hexMatch[2]) as Hex;
    for (const abi of abis) {
      try {
        const decoded = decodeErrorResult({ abi, data: errorData });
        return new Error(`${decoded.errorName}(${decoded.args?.join(', ') ?? ''})`, { cause: error });
      } catch {}
    }
    try {
      const decoded = decodeErrorResult({ abi: [], data: errorData });
      return new Error(`${decoded.errorName}(${decoded.args?.join(', ') ?? ''})`, { cause: error });
    } catch {}
    return new Error(`Unknown contract error ${hexMatch[1]}: ${hexMatch[2]}`, { cause: error });
  }

  return new Error(details || 'unknown contract error', { cause: error });
}
