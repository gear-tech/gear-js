const VARA_DECIMALS = 12;

export function parseVaraAmount(value: number) {
  const [whole, fraction = ''] = value.toString().split('.');
  const paddedFraction = fraction.padEnd(VARA_DECIMALS, '0').slice(0, VARA_DECIMALS);
  return (BigInt(whole) * 10n ** BigInt(VARA_DECIMALS) + BigInt(paddedFraction)).toString();
}
