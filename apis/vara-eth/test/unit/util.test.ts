import type { Abi } from 'viem';
import { BaseError, encodeAbiParameters, keccak256, parseAbiParameters, toBytes } from 'viem';

import { decodeContractError } from '../../src/util/error.js';
import { getRVSComponents } from '../../src/util/signature.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeViemBaseError(details: string): BaseError {
  return new BaseError('test error', { details });
}

/** Builds a `details` string matching the format viem uses for contract reverts. */
function makeContractErrorDetails(signature: string, args: { types: string; values: unknown[] }): string {
  const selector = keccak256(toBytes(signature)).slice(0, 10); // '0x' + 8 hex
  const encoded = encodeAbiParameters(parseAbiParameters(args.types), args.values as never[]);
  return `custom error ${selector}: ${encoded.slice(2)}`; // strip leading '0x'
}

// ---------------------------------------------------------------------------
// getRVSComponents
// ---------------------------------------------------------------------------

describe('getRVSComponents', () => {
  const r = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const s = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

  test('returns numeric v from explicit v field (27n)', () => {
    const result = getRVSComponents({ r, s, v: 27n, yParity: 0 });
    expect(result.v).toBe(27);
    expect(result.r).toBe(r);
    expect(result.s).toBe(s);
  });

  test('returns numeric v from explicit v field (28n)', () => {
    const result = getRVSComponents({ r, s, v: 28n, yParity: 1 });
    expect(result.v).toBe(28);
  });

  test('derives v=27 from yParity=0 when v is undefined', () => {
    const result = getRVSComponents({ r, s, yParity: 0 } as any);
    expect(result.v).toBe(27);
  });

  test('derives v=28 from yParity=1 when v is undefined', () => {
    const result = getRVSComponents({ r, s, yParity: 1 } as any);
    expect(result.v).toBe(28);
  });

  test('prefers v over yParity when both are present', () => {
    const result = getRVSComponents({ r, s, v: 27n, yParity: 1 });
    expect(result.v).toBe(27);
  });

  test('accepts a compact hex string and parses r, s, v=27 (last byte 0x1b)', () => {
    const hex = `0x${'aa'.repeat(32)}${'bb'.repeat(32)}1b` as `0x${string}`;
    const result = getRVSComponents(hex);
    expect(result.r).toBe(`0x${'aa'.repeat(32)}`);
    expect(result.s).toBe(`0x${'bb'.repeat(32)}`);
    expect(result.v).toBe(27);
  });

  test('accepts a compact hex string and parses r, s, v=28 (last byte 0x1c)', () => {
    const hex = `0x${'aa'.repeat(32)}${'bb'.repeat(32)}1c` as `0x${string}`;
    const result = getRVSComponents(hex);
    expect(result.v).toBe(28);
  });

  test('normalizes recovery ID 0 to v=27 (last byte 0x00)', () => {
    const hex = `0x${'aa'.repeat(32)}${'bb'.repeat(32)}00` as `0x${string}`;
    const result = getRVSComponents(hex);
    expect(result.v).toBe(27);
  });

  test('normalizes recovery ID 1 to v=28 (last byte 0x01)', () => {
    const hex = `0x${'aa'.repeat(32)}${'bb'.repeat(32)}01` as `0x${string}`;
    const result = getRVSComponents(hex);
    expect(result.v).toBe(28);
  });
});

// ---------------------------------------------------------------------------
// decodeContractError
// ---------------------------------------------------------------------------

const CUSTOM_ERROR_ABI: Abi = [
  {
    type: 'error',
    name: 'InsufficientFunds',
    inputs: [{ name: 'required', type: 'uint256' }],
  },
];

describe('decodeContractError', () => {
  test('decodes a known custom error from a supplied ABI', () => {
    const details = makeContractErrorDetails('InsufficientFunds(uint256)', {
      types: 'uint256',
      values: [42n],
    });
    const err = makeViemBaseError(details);
    const result = decodeContractError(err, [CUSTOM_ERROR_ABI]);
    expect(result.message).toBe('InsufficientFunds(42)');
  });

  test('decodes built-in Error(string) with empty ABI list', () => {
    const details = makeContractErrorDetails('Error(string)', {
      types: 'string',
      values: ['revert reason'],
    });
    const err = makeViemBaseError(details);
    const result = decodeContractError(err);
    expect(result.message).toBe('Error(revert reason)');
  });

  test('returns Unknown contract error for an unrecognised selector', () => {
    const err = makeViemBaseError('custom error 0xdeadbeef: cafecafe');
    const result = decodeContractError(err, [CUSTOM_ERROR_ABI]);
    expect(result.message).toMatch(/^Unknown contract error 0xdeadbeef/);
  });

  test('extracts details from a BaseError directly', () => {
    const err = makeViemBaseError('custom error 0xdeadbeef: 00');
    const result = decodeContractError(err);
    expect(result.message).toMatch(/^Unknown contract error 0xdeadbeef/);
  });

  test('extracts details from a BaseError nested in cause', () => {
    const inner = makeViemBaseError('custom error 0xdeadbeef: 00');
    const outer = { cause: inner, shortMessage: 'outer msg' };
    const result = decodeContractError(outer);
    expect(result.message).toMatch(/^Unknown contract error 0xdeadbeef/);
  });

  test('returns a generic message when no contract error pattern is present', () => {
    const result = decodeContractError({});
    expect(result.message).toBe('unknown contract error');
  });

  test('uses shortMessage as fallback when details is absent', () => {
    const err = { shortMessage: 'execution reverted' };
    const result = decodeContractError(err);
    expect(result.message).toBe('execution reverted');
  });
});
