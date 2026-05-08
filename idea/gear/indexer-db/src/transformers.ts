export const hexToBytea = {
  to: (v: string | null | undefined): Buffer | null => {
    if (!v) return null;
    const unprefixed = v.startsWith('0x') ? v.slice(2) : v;
    return Buffer.from(unprefixed, 'hex');
  },
  from: (v: Buffer | null | undefined): string | null => {
    if (!v) return null;
    return `0x${v.toString('hex')}`;
  },
};
