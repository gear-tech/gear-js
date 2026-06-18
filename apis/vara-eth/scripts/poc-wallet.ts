#!/usr/bin/env node
/**
 * Phase 0 gate script — proves `@vara-eth/api` can drive the full wallet flow
 * end-to-end against a local `ethexe run --dev` devnet, using only the public
 * lib surface.
 *
 * Flow:
 *
 *   1. Read a WASM file from disk (provide via `--wasm <path>`)
 *   2. Construct a LocalSigner from a private key (`--key 0x…` or env `POC_PRIVATE_KEY`)
 *   3. Call `api.programs.deploy(code)`
 *   4. Call `api.programs.sendAndWait(programAddress, payload, { via: 'injected' })`
 *   5. Print the reply
 *
 * Usage:
 *
 *   PATH_TO_ETHEXE=/path/to/ethexe ethexe run --dev --rpc-port 9944
 *   yarn poc:ethexe \
 *     --eth http://127.0.0.1:8545 \
 *     --ws ws://127.0.0.1:9944 \
 *     --router 0xRouterAddress \
 *     --key 0xac09... \
 *     --wasm ./target/wasm32-gear/release/counter.opt.wasm \
 *     --payload 0x00000000
 *
 * Phase 0 gate: this script does NOT run in CI (no Anvil/ethexe in CI). Instead
 * `yarn typecheck` covers the type integration; this script must be run locally
 * by hand against `ethexe run --dev` whenever the lib surface meaningfully
 * changes.
 */

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { type Address, createPublicClient, type Hex, http } from 'viem';

import { createVaraEthApi, WsVaraEthProvider } from '../src/index.js';
import { privateKeyToLocalSigner } from '../src/signer/adapters/local.js';

interface Args {
  eth: string;
  ws: string;
  router: Address;
  key: Hex;
  wasm: string;
  payload: Hex;
  value: bigint;
  executableBalance: bigint;
}

function readArgs(): Args {
  const { values } = parseArgs({
    options: {
      eth: { type: 'string', default: 'http://127.0.0.1:8545' },
      ws: { type: 'string', default: 'ws://127.0.0.1:9944' },
      router: { type: 'string' },
      key: { type: 'string' },
      wasm: { type: 'string' },
      payload: { type: 'string', default: '0x' },
      value: { type: 'string', default: '0' },
      'executable-balance': { type: 'string', default: '0' },
    },
  });

  const key = (values.key ?? process.env.POC_PRIVATE_KEY) as Hex | undefined;
  const router = values.router as Address | undefined;
  const wasm = values.wasm as string | undefined;

  if (!key) throw new Error('--key (or POC_PRIVATE_KEY) is required');
  if (!router) throw new Error('--router is required (Vara.Eth Router contract address)');
  if (!wasm) throw new Error('--wasm is required (path to a .wasm file)');

  return {
    eth: values.eth!,
    ws: values.ws!,
    router,
    key,
    wasm,
    payload: (values.payload ?? '0x') as Hex,
    value: BigInt(values.value ?? '0'),
    executableBalance: BigInt(values['executable-balance'] ?? '0'),
  };
}

async function main() {
  const args = readArgs();

  console.log(`[poc] reading wasm from ${args.wasm}`);
  const code = new Uint8Array(readFileSync(args.wasm));

  console.log(`[poc] eth=${args.eth} ws=${args.ws} router=${args.router}`);

  const publicClient = createPublicClient({ transport: http(args.eth) });
  const signer = privateKeyToLocalSigner(args.key, publicClient);
  const provider = new WsVaraEthProvider(args.ws);
  await provider.connect();

  const api = await createVaraEthApi(provider, publicClient, args.router, signer);
  console.log(`[poc] api ready — signer=${await signer.getAddress()}`);

  console.log(`[poc] deploying program (${code.length} bytes WASM)…`);
  const deploy = await api.programs.deploy(code, {
    executableBalance: args.executableBalance > 0n ? args.executableBalance : undefined,
  });
  console.log(`[poc] codeId=${deploy.codeId}`);
  console.log(`[poc] programAddress=${deploy.programAddress}`);
  console.log(`[poc] codeValidationTxHash=${deploy.codeValidationReceipt.transactionHash}`);
  console.log(`[poc] deployTxHash=${deploy.deploymentReceipt.transactionHash}`);

  console.log(`[poc] sending injected message…`);
  const result = await api.programs.sendAndWait(deploy.programAddress, args.payload, {
    via: 'injected',
    value: args.value,
  });
  console.log(`[poc] messageId=${result.messageId}`);
  console.log(`[poc] txHash=${result.txHash}`);
  console.log(`[poc] validator=${result.validator}`);
  console.log(`[poc] reply.payload=${result.reply.payload}`);
  console.log(`[poc] reply.value=${result.reply.value}`);
  console.log(`[poc] reply.code=${result.reply.code.reason}`);

  await provider.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('[poc] FAILED:', err);
  process.exit(1);
});
