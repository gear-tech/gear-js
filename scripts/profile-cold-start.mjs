#!/usr/bin/env node

// Times the metadata-window of @polkadot/api's ApiPromise.create against a
// real RPC, comparing bundled (skip state_getMetadata) vs unbundled.
//
// This isolates the server-side savings only — the parse/compile cost of
// shipping ~180 KB to the browser is captured by bundle-size diff + DevTools.
//
// Usage: node scripts/profile-cold-start.mjs [wss://rpc.vara.network] [trials]

import { performance } from 'node:perf_hooks';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { safeDisconnect } from './common.mjs';

const RPC = process.argv[2] ?? 'wss://rpc.vara.network';
const TRIALS = Number(process.argv[3] ?? 5);

const median = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const p95 = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length * 0.95)] ?? xs[xs.length - 1];

async function warm() {
  // One-time connect to extract the chain's current (key, hex) for the bundled run.
  const provider = new WsProvider(RPC, false);
  let api;
  try {
    await provider.connect();
    api = await ApiPromise.create({ provider, noInitWarn: true });
    const key = `${api.genesisHash.toHex()}-${api.runtimeVersion.specVersion.toNumber()}`;
    return { [key]: api.runtimeMetadata.toHex() };
  } finally {
    await safeDisconnect(api, provider);
  }
}

async function trial(metadata) {
  const provider = new WsProvider(RPC, false);
  let api;
  try {
    await provider.connect();
    const t0 = performance.now();
    api = await ApiPromise.create({ provider, metadata, noInitWarn: true });
    const t1 = performance.now();
    return t1 - t0;
  } finally {
    await safeDisconnect(api, provider);
  }
}

async function main() {
  console.log(`profiling ${RPC} (${TRIALS} trials per condition)`);
  const bundledMap = await warm();

  for (const [name, metadata] of [
    ['unbundled', undefined],
    ['bundled  ', bundledMap],
  ]) {
    const runs = [];
    for (let i = 0; i < TRIALS; i++) runs.push(await trial(metadata));
    const m = median(runs).toFixed(0);
    const p = p95(runs).toFixed(0);
    const raw = runs.map((r) => r.toFixed(0)).join(', ');
    console.log(`${name}: median=${m}ms  p95=${p}ms  raw=[${raw}]`);
  }
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
