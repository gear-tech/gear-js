/**
 * P1.4 — Sails IDL extractor unit tests.
 *
 * No live chain; tiny synthetic WASM modules with hand-crafted custom sections.
 */

import { NoSailsIdlError } from '../../src/errors/vara-eth-error.js';
import { extractSailsIdl, extractSailsIdlOrThrow } from '../../src/programs/idl/extract.js';

const textEncoder = new TextEncoder();

/**
 * Builds a minimal valid WASM module (magic + version + arbitrary sections).
 * Each section: [id, leb128(size), bytes].
 */
function buildWasm(sections: { id: number; payload: Uint8Array }[]): Uint8Array {
  const header = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
  const chunks: Uint8Array[] = [header];

  for (const { id, payload } of sections) {
    chunks.push(new Uint8Array([id]));
    chunks.push(encodeULEB128(payload.length));
    chunks.push(payload);
  }

  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function encodeULEB128(value: number): Uint8Array {
  const bytes: number[] = [];
  let v = value >>> 0;
  do {
    let byte = v & 0x7f;
    v >>>= 7;
    if (v !== 0) byte |= 0x80;
    bytes.push(byte);
  } while (v !== 0);
  return new Uint8Array(bytes);
}

function customSection(name: string, content: string): { id: number; payload: Uint8Array } {
  const nameBytes = textEncoder.encode(name);
  const nameLen = encodeULEB128(nameBytes.length);
  const contentBytes = textEncoder.encode(content);
  const payload = new Uint8Array(nameLen.length + nameBytes.length + contentBytes.length);
  payload.set(nameLen, 0);
  payload.set(nameBytes, nameLen.length);
  payload.set(contentBytes, nameLen.length + nameBytes.length);
  return { id: 0, payload };
}

describe('extractSailsIdl', () => {
  const SAMPLE_IDL = 'service Counter { Increment(by: u32) -> u32; };';

  test('extracts IDL from a WASM with `sails_idl` custom section', () => {
    const wasm = buildWasm([customSection('sails_idl', SAMPLE_IDL)]);
    expect(extractSailsIdl(wasm)).toBe(SAMPLE_IDL);
  });

  test('extracts IDL from a WASM with `sails-idl` custom section (alt naming)', () => {
    const wasm = buildWasm([customSection('sails-idl', SAMPLE_IDL)]);
    expect(extractSailsIdl(wasm)).toBe(SAMPLE_IDL);
  });

  test('returns null when no sails section is present', () => {
    const wasm = buildWasm([customSection('producers', 'rustc 1.91')]);
    expect(extractSailsIdl(wasm)).toBeNull();
  });

  test('returns null for empty buffer', () => {
    expect(extractSailsIdl(new Uint8Array(0))).toBeNull();
  });

  test('returns null for non-WASM bytes', () => {
    expect(extractSailsIdl(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))).toBeNull();
  });

  test('returns null when WASM is truncated mid-section', () => {
    const wasm = buildWasm([customSection('sails_idl', SAMPLE_IDL)]);
    // Chop off the last byte → custom section body becomes shorter than its size header.
    expect(extractSailsIdl(wasm.subarray(0, wasm.length - 1))).toBeNull();
  });

  test('finds the sails section even when it follows other custom sections', () => {
    const wasm = buildWasm([
      customSection('producers', 'rustc 1.91'),
      customSection('sails_idl', SAMPLE_IDL),
      customSection('name', 'foo'),
    ]);
    expect(extractSailsIdl(wasm)).toBe(SAMPLE_IDL);
  });

  test('extractSailsIdlOrThrow throws NoSailsIdlError on missing section', () => {
    const wasm = buildWasm([customSection('producers', 'rustc 1.91')]);
    expect(() => extractSailsIdlOrThrow(wasm)).toThrow(NoSailsIdlError);
  });

  test('extractSailsIdlOrThrow returns the IDL when present', () => {
    const wasm = buildWasm([customSection('sails_idl', SAMPLE_IDL)]);
    expect(extractSailsIdlOrThrow(wasm)).toBe(SAMPLE_IDL);
  });
});
