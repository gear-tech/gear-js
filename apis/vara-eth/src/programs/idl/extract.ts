/**
 * Sails IDL extraction from a Gear program WASM binary.
 *
 * Gear programs ship their Sails IDL as a WASM custom section named `sails_idl`
 * (or `sails-idl` — both casings are tolerated for forward-compat). This module
 * parses the WASM module structure just deeply enough to extract that section,
 * without instantiating or validating the code.
 *
 * Pure function, no side effects, no I/O.
 *
 * @example
 * ```ts
 * import { readFileSync } from 'node:fs';
 * import { extractSailsIdl } from '@vara-eth/api';
 *
 * const wasm = readFileSync('counter.opt.wasm');
 * const idl = extractSailsIdl(wasm);
 * if (idl) console.log(idl);
 * ```
 */

import { NoSailsIdlError } from '../../errors/vara-eth-error.js';

const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d]; // \0asm
const WASM_VERSION = [0x01, 0x00, 0x00, 0x00]; // v1
const CUSTOM_SECTION_ID = 0;

const SAILS_IDL_SECTION_NAMES = new Set(['sails_idl', 'sails-idl']);

const textDecoder = new TextDecoder('utf-8', { fatal: false });

/**
 * Reads an unsigned LEB128 integer from `bytes` starting at `offset`.
 * Returns the value and the number of bytes consumed.
 *
 * Throws if the LEB128 doesn't terminate within `bytes` bounds.
 */
function readULEB128(bytes: Uint8Array, offset: number): { value: number; bytesRead: number } {
  let result = 0;
  let shift = 0;
  let bytesRead = 0;
  let byte: number;

  do {
    if (offset + bytesRead >= bytes.length) {
      throw new Error('Truncated LEB128 integer in WASM');
    }
    byte = bytes[offset + bytesRead]!;
    result |= (byte & 0x7f) << shift;
    shift += 7;
    bytesRead += 1;
    // Guard against pathologically long encodings; 5 bytes covers 32-bit values.
    if (bytesRead > 5) {
      throw new Error('LEB128 integer too long (max 5 bytes for 32-bit value)');
    }
  } while ((byte & 0x80) !== 0);

  return { value: result >>> 0, bytesRead };
}

function startsWithBytes(bytes: Uint8Array, expected: number[]): boolean {
  if (bytes.length < expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (bytes[i] !== expected[i]) return false;
  }
  return true;
}

/**
 * Extracts the Sails IDL text from a Gear program WASM binary.
 *
 * @param wasm - The WASM module bytes (raw `.wasm` file contents)
 * @returns The IDL source as a UTF-8 string, or `null` if no `sails_idl` /
 *   `sails-idl` custom section is present. Returns `null` (not throw) on a
 *   truncated/malformed WASM — silent best-effort, since callers will fall back
 *   to opaque-payload mode.
 */
export function extractSailsIdl(wasm: Uint8Array): string | null {
  if (!startsWithBytes(wasm, WASM_MAGIC)) return null;
  if (!startsWithBytes(wasm.subarray(4), WASM_VERSION)) return null;

  let offset = 8; // past magic + version

  try {
    while (offset < wasm.length) {
      const sectionId = wasm[offset]!;
      offset += 1;

      const { value: sectionSize, bytesRead: sizeBytes } = readULEB128(wasm, offset);
      offset += sizeBytes;

      const sectionEnd = offset + sectionSize;
      if (sectionEnd > wasm.length) return null; // truncated

      if (sectionId === CUSTOM_SECTION_ID) {
        // Custom section: <name-len:uleb><name:utf8><payload:bytes>
        const { value: nameLen, bytesRead: nameLenBytes } = readULEB128(wasm, offset);
        const nameStart = offset + nameLenBytes;
        const nameEnd = nameStart + nameLen;
        if (nameEnd > sectionEnd) return null; // malformed

        const name = textDecoder.decode(wasm.subarray(nameStart, nameEnd));
        if (SAILS_IDL_SECTION_NAMES.has(name)) {
          const payload = wasm.subarray(nameEnd, sectionEnd);
          return textDecoder.decode(payload);
        }
      }

      offset = sectionEnd;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Strict variant of {@link extractSailsIdl} that throws {@link NoSailsIdlError}
 * when the section is missing. Use when an IDL is expected to be present and
 * its absence is a hard failure.
 */
export function extractSailsIdlOrThrow(wasm: Uint8Array): string {
  const idl = extractSailsIdl(wasm);
  if (idl === null) {
    throw new NoSailsIdlError();
  }
  return idl;
}
