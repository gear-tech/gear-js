export const hexToBytea = {
  to: (v: string | null | undefined): Buffer | null => {
    if (!v) return null;
    return Buffer.from(v.slice(2), 'hex');
  },
  from: (v: Buffer | null | undefined): string | null => {
    if (!v) return null;
    return '0x' + v.toString('hex');
  },
};
