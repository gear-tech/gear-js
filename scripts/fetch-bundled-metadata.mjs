#!/usr/bin/env node

// Fetch chain runtime metadata from configured Vara RPCs and write a
// generated TypeScript module the frontend can pass to ApiOptions.metadata.
//
// Idempotent: skips writing when content hashes match.
// Atomic: pins runtimeVersion + metadata to a single finalized block hash so a
//         runtime upgrade between RPC calls can't produce a mismatched pair.
// Validated: reconstructs an ApiPromise from the generated map and decodes a
//            known extrinsic before writing — catches matching-key-bad-blob.
//
// Usage: node scripts/fetch-bundled-metadata.mjs

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import * as path from 'node:path';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { ROOT_DIR, safeDisconnect, withTimeout } from './common.mjs';

const TIMEOUT_MS = 30_000;
const HEX_RE = /^0x[0-9a-fA-F]+$/;
const KEY_RE = /^0x[0-9a-fA-F]+-\d+$/;

const log = (msg) => console.log(`[bundled-metadata] ${msg}`);
const withT = (p, label) => withTimeout(p, label, TIMEOUT_MS);

async function fetchOne({ name, rpc, expectedGenesis }) {
  log(`${name}: connecting to ${rpc}`);
  const provider = new WsProvider(rpc, false);
  let api;
  try {
    await withT(provider.connect(), `${name} connect`);
    api = await withT(ApiPromise.create({ provider, noInitWarn: true }), `${name} ApiPromise.create`);

    // Pin runtime version + metadata to ONE finalized block hash. ApiPromise.create
    // loads metadata at connect time, which can be a different block than headHash
    // — during a runtime upgrade that produces a mismatched (key, hex) pair. Fetch
    // both runtimeVersion and metadata against the same headHash to guarantee the
    // pair is consistent.
    const headHash = await withT(api.rpc.chain.getFinalizedHead(), `${name} getFinalizedHead`);
    const runtimeVersion = await withT(api.rpc.state.getRuntimeVersion(headHash), `${name} getRuntimeVersion`);
    const metadataAtHead = await withT(api.rpc.state.getMetadata(headHash), `${name} getMetadata`);

    const hex = metadataAtHead.toHex();
    const genesisHash = api.genesisHash.toHex();
    const specVersion = runtimeVersion.specVersion.toNumber();
    const key = `${genesisHash}-${specVersion}`;

    if (!HEX_RE.test(hex)) throw new Error(`${name}: metadata is not strict hex`);
    if (!KEY_RE.test(key)) throw new Error(`${name}: invalid key shape "${key}"`);

    // Guard against DNS hijack / RPC compromise: if the target declares an
    // expectedGenesis, assert the live chain matches. A wrong genesis would
    // otherwise ship under an attacker's key (never matches real clients, but
    // the bundle stays corrupt until next refresh).
    if (expectedGenesis && genesisHash !== expectedGenesis) {
      throw new Error(`${name}: genesisHash mismatch — got ${genesisHash}, expected ${expectedGenesis}`);
    }

    log(`${name}: ok (key=${key}, ${hex.length} hex chars)`);
    return { name, key, hex };
  } finally {
    await safeDisconnect(api, provider);
  }
}

async function validateEntry(entry, target) {
  // Reconstruct a real ApiPromise against the entry's own RPC, using a SINGLE-ENTRY
  // map (key→hex from the fetch step), so polkadot-js is forced to consume this
  // entry rather than refetching from chain. Catches the matching-key-bad-blob
  // case that stale-key fallback can't catch — for every target, not just one.
  const singleEntryMap = { [entry.key]: entry.hex };
  log(`validating ${target.name}: reconstructing ApiPromise from {${entry.key}} against ${target.rpc}`);
  const provider = new WsProvider(target.rpc, false);
  let api;
  try {
    await withT(provider.connect(), `${target.name} validate connect`);
    api = await withT(
      ApiPromise.create({ provider, metadata: singleEntryMap, noInitWarn: true }),
      `${target.name} validate ApiPromise.create`,
    );
    const dest = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    const hex = api.tx.balances.transferAllowDeath(dest, 1n).toHex();
    if (!hex.startsWith('0x')) throw new Error(`${target.name} validate: extrinsic hex did not start with 0x`);
    log(`validating ${target.name}: ok (extrinsic decoded, ${hex.length} hex chars)`);
  } finally {
    await safeDisconnect(api, provider);
  }
}

async function main() {
  const cfgPath = path.join(ROOT_DIR, 'scripts', 'bundled-metadata.config.json');
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));

  const entries = await Promise.all(cfg.targets.map(fetchOne));

  // Reject duplicate keys (two RPCs serving the same chain at the same spec).
  const keys = new Set();
  for (const e of entries) {
    if (keys.has(e.key)) throw new Error(`duplicate key: ${e.key}`);
    keys.add(e.key);
  }

  const map = Object.fromEntries(entries.map((e) => [e.key, e.hex]));

  // Validate every (entry, target) pair so corruption in a non-primary target
  // (e.g. testnet) blocks the bundle write instead of silently shipping.
  for (let i = 0; i < entries.length; i++) {
    await validateEntry(entries[i], cfg.targets[i]);
  }

  const body = entries.map((e) => `  '${e.key}': '${e.hex}',`).join('\n');
  const inner = `export const BUNDLED_METADATA: Record<\`0x\${string}-\${number}\`, \`0x\${string}\`> = {\n${body}\n};\n`;
  const hash = createHash('sha256').update(inner).digest('hex').slice(0, 12);
  const final =
    `// AUTO-GENERATED by scripts/fetch-bundled-metadata.mjs — DO NOT EDIT\n` +
    `// content-hash: ${hash}\n` +
    `// last-refreshed: ${new Date().toISOString()}\n` +
    inner;

  let wrote = false;
  for (const out of cfg.outputs) {
    const outPath = path.join(ROOT_DIR, out);
    if (existsSync(outPath)) {
      const cur = readFileSync(outPath, 'utf8');
      const curHash = cur.match(/content-hash: (\w+)/)?.[1];
      if (curHash === hash) {
        log(`no change: ${out}`);
        continue;
      }
    }
    writeFileSync(outPath, final);
    log(`wrote ${out}`);
    wrote = true;
  }

  if (!wrote) log('all outputs unchanged');
}

main().catch((error) => {
  console.error('[bundled-metadata] FAILED:', error.message);
  process.exit(1);
});
