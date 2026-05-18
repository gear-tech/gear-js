#!/usr/bin/env node
// Usage: node scripts/request-validation.mjs <wasm-file> <api-url> <network>
// Env: PRIVATE_KEY, ETHEREUM_RPC_URL, ROUTER_ADDRESS

import { readFileSync } from 'node:fs';
import { getWrappedVaraClient } from '@vara-eth/api/eth/contracts';
import { getRouterClient } from '@vara-eth/api/eth/router';
import { walletClientToSigner } from '@vara-eth/api/signer';
import dotenv from 'dotenv';
import { createPublicClient, createWalletClient, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { bytesToHex } from 'viem/utils';

dotenv.config();

const [wasmFile, apiUrl, network] = process.argv.slice(2);

if (!wasmFile || !apiUrl || !network) {
  console.error('Usage: node scripts/request-validation.mjs <wasm-file> <api-url> <network>');
  process.exit(1);
}

for (const envVar of ['PRIVATE_KEY', 'ETHEREUM_RPC_URL', 'ROUTER_ADDRESS']) {
  if (!process.env[envVar]) {
    console.error(`Missing ${envVar} env var`);
    process.exit(1);
  }
}

const code = readFileSync(wasmFile);

const transport = webSocket(process.env.ETHEREUM_RPC_URL);
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const publicClient = createPublicClient({ transport });
const walletClient = createWalletClient({ transport, account });
const signer = walletClientToSigner(walletClient);

const routerAddress = process.env.ROUTER_ADDRESS;
const router = getRouterClient({ address: routerAddress, publicClient, signer });

const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

const [wvaraAddress, baseFee, extraFee] = await Promise.all([
  router.wrappedVara(),
  router.requestCodeValidationBaseFee(),
  router.requestCodeValidationExtraFee(),
]);
const totalFee = baseFee + extraFee;
console.log('WVARA address:', wvaraAddress);
console.log('Total fee:', totalFee);

const wvara = getWrappedVaraClient({ address: wvaraAddress, publicClient, signer });

const [{ signature: wvaraPermitSignature }, { codeId, blobHashes, signature: requestCodeValidationSignature }] =
  await Promise.all([
    wvara.prepareAndSignPermitData(routerAddress, totalFee, deadline),
    router.prepareAndSignRequestCodeValidationPermitData(code, deadline),
  ]);

console.log('codeId:', codeId);
console.log('blobHashes:', blobHashes);

const body = {
  code: bytesToHex(code),
  codeId,
  sender: account.address,
  blobHashes,
  deadline: Number(deadline),
  wvaraPermitSignature,
  requestCodeValidationSignature,
};

console.log('Sending request...');
const res = await fetch(`${apiUrl}/${network}/request-code-validation`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const data = await res.json();
console.log('Response:', data);

const id = data.jobId;

await new Promise((resolve) => setTimeout(resolve, 3000));

console.log('Checking status...');
const statusRes = await fetch(`${apiUrl}/status?jobId=${id}`);

const statusData = await statusRes.json();
console.log('Response:', statusData);

process.exit(0);
