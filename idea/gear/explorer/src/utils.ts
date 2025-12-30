export const isHex = (value: unknown): value is `0x${string}` => {
  const HEX_REGEX = /^0x[\da-fA-F]+$/;

  return typeof value === 'string' && (value === '0x' || (HEX_REGEX.test(value) && value.length % 2 === 0));
};
