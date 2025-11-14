export function bigint128ToBytes(value: bigint, littleEndian = false): Uint8Array {
  const bytes = new Uint8Array(16);
  const view = new DataView(bytes.buffer);

  if (littleEndian) {
    view.setBigUint64(0, value, true);
    view.setBigUint64(8, value >> 64n, true);
  } else {
    view.setBigUint64(0, value >> 64n, false);
    view.setBigUint64(8, value, false);
  }

  return bytes;
}
