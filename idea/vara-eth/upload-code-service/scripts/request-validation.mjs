#!/usr/bin/env node
// Usage: node scripts/request-validation.mjs <wasm-file> <api-url>
// Env: PRIVATE_KEY

import { readFileSync } from 'node:fs';
import { blake2b } from '@noble/hashes/blake2';
import { loadKZG } from 'kzg-wasm';
import { privateKeyToAccount } from 'viem/accounts';
import { bytesToHex, hexToBytes, sha256 } from 'viem/utils';

import { simpleSidecarEncode } from '../../../../apis/vara-eth/lib/util/blob.js';

const [wasmFile, apiUrl] = process.argv.slice(2);

if (!wasmFile || !apiUrl) {
  console.error('Usage: node scripts/request-validation.mjs <wasm-file> <api-url>');
  process.exit(1);
}

if (!process.env.PRIVATE_KEY) {
  console.error('Missing PRIVATE_KEY env var');
  process.exit(1);
}

const code = readFileSync(wasmFile);
const codeHex = bytesToHex(code);

const codeId = bytesToHex(blake2b(code, { dkLen: 32 }));
console.log('codeId:', codeId);

const blob = simpleSidecarEncode(code)[0];
const blobHex = bytesToHex(blob);

const kzg = await loadKZG();
const commitment = kzg.blobToKZGCommitment(blobHex);

const versionedHash = sha256(hexToBytes(commitment), 'bytes');
versionedHash.set([0x01], 0);
const blobHash = bytesToHex(versionedHash);
console.log('blobHash:', blobHash);

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const signature = await account.signMessage({ message: blobHash + codeId });

const body = { code: codeHex, codeId, sender: account.address, blobHash, signature };

console.log('Sending request...');
const res = await fetch(`${apiUrl}/request-code-validation`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const data = await res.json();
console.log('Response:', data);
