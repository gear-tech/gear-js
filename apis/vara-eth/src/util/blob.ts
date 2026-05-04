import { loadKZG } from 'kzg-wasm';
import { bytesToHex, type Hex, hexToBytes, sha256 } from 'viem';

let loadKzgPromise: ReturnType<typeof loadKZG>;

/**
 * Starts loading the KZG WASM library in the background.
 *
 * `kzg-wasm` is memory-intensive and is only needed when submitting EIP-4844 blob
 * transactions (i.e. code upload via `RouterClient.requestCodeValidation`). Without
 * this call, the module would be loaded eagerly at import time, consuming memory even
 * in applications that never use code upload.
 *
 * Call this once at application startup if your application uses code upload
 * functionality. This allows KZG initialization to proceed in parallel with other
 * setup work, so `waitForKzg` resolves immediately (or with minimal delay) when a
 * code upload is eventually triggered.
 *
 * If not called explicitly, loading begins lazily on the first call to `waitForKzg`.
 *
 * @example
 * import { initKzgLoading } from '@vara-eth/api/util';
 *
 * // Call once at startup, before any code upload operations
 * initKzgLoading();
 */
export const initKzgLoading = () => {
  if (loadKzgPromise === undefined) {
    loadKzgPromise = loadKZG();
  }
};

let kzg: Awaited<ReturnType<typeof loadKZG>> | undefined;

export const waitForKzg = async () => {
  if (loadKzgPromise === undefined) {
    initKzgLoading();
  }

  kzg = await loadKzgPromise;

  return kzg;
};

export const getKzg = () => {
  if (kzg === undefined) {
    throw new Error('KZG not loaded');
  }

  return kzg;
};

const BYTES_PER_BLOB = 131_072;
const FIELD_ELEMENTS_PER_BLOB = 4096;
const FE_BYTES = 32;
const USABLE_BYTES_PER_FE = 31;

export function simpleSidecarEncode(data: Uint8Array): Uint8Array[] {
  const blobs: Uint8Array[] = [];
  let feCount = 0;

  const pushEmptyBlob = () => {
    blobs.push(new Uint8Array(BYTES_PER_BLOB));
  };

  const currentBlob = () => {
    const index = Math.floor(feCount / FIELD_ELEMENTS_PER_BLOB);
    while (blobs.length <= index) pushEmptyBlob();
    return blobs[index];
  };

  const feOffsetInCurrentBlob = () => (feCount % FIELD_ELEMENTS_PER_BLOB) * FE_BYTES;

  const ingestFE = (fe: Uint8Array) => {
    const blob = currentBlob();
    const offset = feOffsetInCurrentBlob();
    blob.set(fe, offset);
    feCount++;
  };

  if (data.length === 0) return blobs;

  const lenFE = new Uint8Array(FE_BYTES);
  const lenBytes = new DataView(lenFE.buffer);
  lenBytes.setBigUint64(1, BigInt(data.length));
  ingestFE(lenFE);

  let offset = 0;
  while (offset < data.length) {
    const fe = new Uint8Array(FE_BYTES);
    const chunkSize = Math.min(USABLE_BYTES_PER_FE, data.length - offset);
    fe.set(data.subarray(offset, offset + chunkSize), 1);
    offset += chunkSize;
    ingestFE(fe);
  }

  return blobs;
}

export function calculateBlobVersionedHashesAndCommitments(blobs: Uint8Array[]) {
  const blobHexes = blobs.map((b) => bytesToHex(b));

  const kzg = getKzg();

  const commitmentHexes = blobHexes.map((hex) => kzg.blobToKZGCommitment(hex) as Hex);

  const blobVersionedHashes = commitmentHexes.map((c) => {
    const hash = sha256(c, 'bytes');
    hash.set([0x01], 0);
    return bytesToHex(hash);
  });

  const blobCommitmentsMap = new Map(blobHexes.map((hex, i) => [hex, commitmentHexes[i]]));

  return { blobVersionedHashes, blobCommitmentsMap };
}

export const computeBlobKzgProof = (blob: Uint8Array, commitment: Uint8Array) => {
  const result = getKzg().computeBlobKZGProof(bytesToHex(blob), bytesToHex(commitment)) as Hex;
  return hexToBytes(result);
};

export const computeCellsAndKzgProofs = (blob: Uint8Array): [Uint8Array[], Uint8Array[]] => {
  const [cells, proofs] = getKzg().computeCellsAndProofs(bytesToHex(blob)) as [Hex[], Hex[]];
  return [cells.map((cell) => hexToBytes(cell)), proofs.map((proof) => hexToBytes(proof))];
};

export const blobToKzgCommitment = (commitmentMap: Map<Hex, Hex>) => (blob: Uint8Array) => {
  const commitment = commitmentMap.get(bytesToHex(blob));
  if (!commitment) {
    throw new Error('Blob not found in commitments map');
  }
  return hexToBytes(commitment);
};
