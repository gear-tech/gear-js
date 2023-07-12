import { KeyringPair } from '@polkadot/keyring/types';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import { OptionsWithMeta, createMetadata } from '@substrate/txwrapper-core';
import fetch from 'node-fetch';

/**
 * Send a JSONRPC request to the node at http://0.0.0.0:9933.
 *
 * @param method - The JSONRPC request method.
 * @param params - The JSONRPC request params.
 */
export function rpcToLocalNode(method: string, params: any[] = []): Promise<any> {
  return fetch('http://0.0.0.0:9933', {
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method,
      params,
    }),
    headers: {
      'Content-Type': 'application/json',
      connection: 'keep-alive',
    },
    method: 'POST',
  })
    .then((response) => response.json() as any)
    .then(({ error, result }) => {
      if (error) {
        throw new Error(`${method} :: ${error.code} ${error.message}: ${JSON.stringify(error.data)}`);
      }

      return result;
    });
}

/**
 * Signing function. Implement this on the OFFLINE signing device.
 *
 * @param pair - The signing pair.
 * @param signingPayload - Payload to sign.
 * @returns A signed ExtrinsicPayload returns a signature with the type `0x${string}` via polkadot-js.
 */
export function signWith(pair: KeyringPair, signingPayload: string, options: OptionsWithMeta): `0x${string}` {
  const { registry, metadataRpc } = options;
  // Important! The registry needs to be updated with latest metadata, so make
  // sure to run `registry.setMetadata(metadata)` before signing.
  registry.setMetadata(createMetadata(registry, metadataRpc));

  const { signature } = registry
    .createType('ExtrinsicPayload', signingPayload, {
      version: EXTRINSIC_VERSION,
    })
    .sign(pair);

  return signature as unknown as `0x${string}`;
}
