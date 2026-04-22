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
