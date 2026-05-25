/// <reference lib="webworker" />

import { calculateBlobVersionedHashesAndCommitments, simpleSidecarEncode, waitForKzg } from '@vara-eth/api/util';
import type { Hex } from 'viem';

self.onmessage = async (event: MessageEvent) => {
  const { id, type, payload } = event.data;

  try {
    if (type === 'init') {
      await waitForKzg();
      self.postMessage({ id, type: 'init:success' });
      return;
    }

    if (type === 'computeBlobHashes') {
      await waitForKzg();

      const code: Uint8Array = payload.code;
      const blobs = simpleSidecarEncode(code);
      const { blobVersionedHashes } = calculateBlobVersionedHashesAndCommitments(blobs);

      self.postMessage({
        id,
        type: 'computeBlobHashes:success',
        result: blobVersionedHashes as Hex[],
      });
      return;
    }
  } catch (error) {
    self.postMessage({
      id,
      type: `${type}:error`,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Start loading KZG as soon as the worker boots.
waitForKzg();
