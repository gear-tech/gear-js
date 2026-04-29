import { type Hex, parseSignature, type Signature } from 'viem';

/**
 * Extracts `r`, `s`, and `v` components from a signature.
 * Derives `v` from `yParity` (0 → 27, 1 → 28) when `v` is not present.
 *
 * @param signature - The viem signature object
 * @returns An object with `r`, `s`, and numeric `v` components ready for ABI encoding
 */
export function getRVSComponents(signature: Signature | Hex) {
  const { r, s, v, yParity } = typeof signature === 'string' ? parseSignature(signature) : signature;

  const vBigInt = v ?? (yParity === 0 ? 27n : 28n);
  return {
    r,
    s,
    v: Number(vBigInt),
  };
}
